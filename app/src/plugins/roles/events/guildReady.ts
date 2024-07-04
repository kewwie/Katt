import { Guild } from "discord.js";
import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildUserEntity } from "../../../entities/GuildUser";

import { GetHighestRole } from "../functions/getHighestRole";

/**
 * @type {Event}
 */
export const GuildReady: Event = {
    name: Events.GuildReady,

    /**
     * @param {Guild} guild
     */
    async getGuildId(guild: Guild) {
        return guild.id;
    },

    /**
    * @param {KiwiClient} client
    * @param {Guild} guild
    */
    async execute(client: KiwiClient, guild: Guild) {
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: guild.id } });
        var roles = {
            1: guildConfig.levelOne,
            2: guildConfig.levelTwo,
            3: guildConfig.levelThree,
            4: guildConfig.levelFour,
            5: guildConfig.levelFive
        };

        var isUser = await GuildUserRepository.findOne({
            where: {
                guildId: guild.id,
                userId: guild.ownerId
            }
        });
        var owner = await guild.members.fetch(guild.ownerId).catch(() => {});

        if (isUser && owner) {
            GuildUserRepository.update({
                guildId: guild.id,
                userId: guild.ownerId
            }, { level: 5, userName: owner.user.username});

        } else if (owner) {
            GuildUserRepository.insert({
                guildId: guild.id,
                userId: guild.ownerId,
                userName: owner.user.username,
                level: 5
            });
        }
        if (highestRole && owner) {
            await owner.roles.add((await GetHighestRole(isUser.level, roles))).catch(() => {});
        }

        var owners = await GuildUserRepository.find({ where: { guildId: guild.id, level: 5 } });
        if (owners) {
            for (let owner of owners) {
                if (owner.userId === guild.ownerId) continue;
                GuildUserRepository.delete({ guildId: guild.id, userId: owner.userId });
                let OwnerMember = await guild.members.fetch(owner.userId).catch(() => {});
                if (OwnerMember) {
                    OwnerMember.roles.remove(Object.values(roles)).catch(() => {});
                }
            }
        }

        for (let member of (await guild.members.fetch()).values()) {
            let user = await GuildUserRepository.findOne({ where: { guildId: guild.id, userId: member.id } });

            var highestRole = await GetHighestRole(user?.level, roles);
            if (!member.roles.cache.has(highestRole)) member.roles.add(highestRole).catch(() => {});
            for (let roleId of Object.values(roles)) {
                if (roleId !== highestRole && member.roles.cache.has(roleId)) {
                    member.roles.remove(roleId);
                }
            }
        }

        for (var user of await GuildUserRepository.find({ where: { guildId: guild.id } })) {
            let member = await guild.members.fetch(user.userId).catch(() => {});
            if (!member) continue;

            let highestRole = await GetHighestRole(user.level, roles);
            if (!member.roles.cache.has(highestRole)) member.roles.add(highestRole).catch(() => {});
            for (let roleId of Object.values(roles)) {
                if (roleId !== highestRole && member.roles.cache.has(roleId)) {
                    member.roles.remove(roleId);
                }
            }
        }
    }
}