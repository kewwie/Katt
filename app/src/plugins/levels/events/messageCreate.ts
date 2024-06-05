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

        var newXp = 50;

        // Add boosts here

        var LevelUser = await UserLevelRepository.findOne({ where: { guildId: message.guild.id, userId: message.author.id } });
        if (LevelUser) {
            if (new Date().getMinutes() !== LevelUser.updatedAt.getMinutes()) {
                var levelXp = LevelUser.levelXp - newXp;
                var userXp = LevelUser.userXp + newXp;
                var level = LevelUser.level;

                if (levelXp <= 0) {
                    level = LevelUser.level + 1;
                    levelXp = await client.calculateXP(level) - LevelUser.xp;
                    userXp= await client.calculateXP(level - 1) - LevelUser.xp;

                    // Add level up message here
                }

                await UserLevelRepository.update(LevelUser._id, {
                    xp: userXp,
                    level: level,
                    levelXp: levelXp,
                    updatedAt: new Date()
                });
            }
        } else {
            await UserLevelRepository.insert({
                guildId: message.guild.id,
                userId: message.author.id,
                level: 0,
                xp: newXp,
                updatedAt: new Date()
            });
        }
    }
}