import { Guild } from "discord.js";
import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildUserEntity } from "../../../entities/GuildUser";


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
        console.log("GuildReady")
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: guild.id } });
        let roles = {
            level5: guildConfig?.levelFive,
            level4: guildConfig?.levelFour,
            level3: guildConfig?.levelThree,
            level2: guildConfig?.levelTwo,
            level1: guildConfig?.levelOne
        }

        var isUser = await GuildUserRepository.findOne({
            where: {
                guildId: guild.id,
                userId: guild.ownerId
            }
        });
        var member = await guild.members.fetch(guild.ownerId);

        if (isUser) {
            GuildUserRepository.update({
                guildId: guild.id,
                userId: guild.ownerId
            }, { level: 5, userName: member.user.username});
        } else {
            GuildUserRepository.insert({
                guildId: guild.id,
                userId: guild.ownerId,
                userName: member.user.username,
                level: 5
            });
        }

        let highestRole = Object.values(roles).find(role => role !== null);
        if (highestRole) {
            await member.roles.add(highestRole);
        }

        var owners = await GuildUserRepository.find({ where: { guildId: guild.id, level: 5 } });
        if (owners) {
            for (let owner of owners) {
                if (owner.userId === guild.ownerId) continue;
                GuildUserRepository.delete({ guildId: guild.id, userId: owner.userId });
                let OwnerMember = await guild.members.fetch(owner.userId);
                if (OwnerMember) {
                    OwnerMember.roles.remove(Object.values(roles)).catch(() => {});
                }
            }
        }

        for (let member of (await guild.members.fetch()).values()) {
            let user = await GuildUserRepository.findOne({ where: { guildId: guild.id, userId: member.id } });

            for (var role of Object.values(roles)) {
                if (member.roles.cache.has(role)) {
                    switch (role) {
                        case roles.level5: {
                            if (user.level >= 5) member.roles.remove(roles.level5);
                            break;
                        }

                        case roles.level4: {
                            if (user.level >= 4) member.roles.remove(roles.level4);
                            break;
                        }

                        case roles.level3: {
                            if (user.level >= 3) member.roles.remove(roles.level3);
                            break;
                        }

                        case roles.level2: {
                            if (user.level >= 2) member.roles.remove(roles.level2);
                            break;
                        }

                        case roles.level1: {
                            if (user.level >= 1) member.roles.remove(roles.level1);
                            break;
                        }
                    }
                }
            }
        }
    }
}