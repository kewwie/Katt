import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import { Message } from "discord.js";

import { dataSource } from "../../../datasource";
import { UserLevel } from "../../../entities/UserLevel";

/**
 * @type {Event}
 */
export const MessageCreate: Event = {
    name: Events.MessageCreate,

    /**
     * @param {Message} message
     */
    async getGuildId(message: Message) {
        return message.guild.id;
    },

    /**
    * @param {KiwiClient} client
    * @param {Message} message
    */
    async execute(client: KiwiClient, message: Message) {
        const UserLevelRepository = await dataSource.getRepository(UserLevel);

        if (message.author.bot) return;

        var newXp = 50;

        // Add boosts here

        var LevelUser = await UserLevelRepository.findOne({ where: { guildId: message.guild.id, userId: message.author.id } });
        if (LevelUser) {
            if (new Date().getMinutes() !== LevelUser.updatedAt.getMinutes()) {
                var levelXp = LevelUser.levelXp;
                var userXp = LevelUser.userXp + newXp;
                var level = LevelUser.level;
                var xp = LevelUser.xp + newXp;

                if (userXp >= levelXp) {
                    level = LevelUser.level + 1;
                    levelXp = await client.calculateXP(level);
                    userXp = await client.calculateXP(level) - xp;
                }

                await UserLevelRepository.update(LevelUser._id, {
                    xp,
                    level,
                    levelXp,
                    userXp,
                    updatedAt: new Date()
                });
            }
        } else {
            await UserLevelRepository.insert({
                guildId: message.guild.id,
                userId: message.author.id,
                level: 0,
                xp: newXp,
                userXp: newXp,
                levelXp: await client.calculateXP(1),
                updatedAt: new Date()
            });
        }
    }
}