import { Guild } from "discord.js";
import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildUserEntity } from "../../../entities/GuildUser";

/**
 * @type {Event}
 */
export const GuildCreate: Event = {
    name: Events.GuildCreate,

    /**
     * @param {Guild} guild
     */
    async getGuildId(guild: Guild) {
        return guild.id;
    },

    /**
    * @param {Client} client
    * @param {Guild} guild
    */
    async execute(client: KiwiClient, guild: Guild) {
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: guild.id } });
        let roles = [
            guildConfig.levelFive,
            guildConfig.levelFour,
            guildConfig.levelThree,
            guildConfig.levelTwo,
            guildConfig.levelOne
        ]

        var isUser = await GuildUserRepository.findOne({
            where: {
                guildId: guild.id,
                userId: guild.ownerId
            }
        });
        var member = await guild.members.fetch(guild.ownerId).catch(() => {});

        if (isUser && member) {
            GuildUserRepository.update({
                guildId: guild.id,
                userId: guild.ownerId
            }, { level: 5, userName: member.user.username});
        } else if (member) {
            GuildUserRepository.insert({
                guildId: guild.id,
                userId: guild.ownerId,
                userName: member.user.username,
                level: 5
            });
        }

        let highestRole = roles.find(role => role !== null);
        if (highestRole && member) {
            await member.roles.add(highestRole);
        }

        var owners = await GuildUserRepository.find({ where: { guildId: guild.id, level: 5 } });
        if (owners) {
            for (let owner of owners) {
                if (owner.userId === guild.ownerId) continue;
                GuildUserRepository.delete({ guildId: guild.id, userId: owner.userId });
                let OwnerMember = await guild.members.fetch(owner.userId).catch(() => {});
                if (OwnerMember) {
                    OwnerMember.roles.remove(roles).catch(() => {});
                }
            }
        }
    }
}