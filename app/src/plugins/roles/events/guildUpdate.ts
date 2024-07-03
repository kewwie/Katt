import { Guild } from "discord.js";
import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildUserEntity } from "../../../entities/GuildUser";

/**
 * @type {Event}
 */
export const GuildUpdate: Event = {
    name: Events.GuildUpdate,

    /**
     * @param {Guild} guild
     */
    async getGuildId(guild: Guild) {
        return guild.id;
    },

    /**
    * @param {Client} client
    * @param {Guild} oldGuild
    * @param {Guild} newGuild
    */
    async execute(client: KiwiClient, oldGuild: Guild, newGuild: Guild) {
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: newGuild.id } });
        let roles = [
            guildConfig.levelFive,
            guildConfig.levelFour,
            guildConfig.levelThree,
            guildConfig.levelTwo,
            guildConfig.levelOne
        ]

        if (oldGuild.ownerId !== newGuild.ownerId) {
            var isUser = await GuildUserRepository.findOne({
                where: {
                    guildId: newGuild.id,
                    userId: newGuild.ownerId
                }
            });
            var member = await newGuild.members.fetch(newGuild.ownerId);

            if (isUser) {
                GuildUserRepository.update({
                    guildId: newGuild.id,
                    userId: newGuild.ownerId
                }, { level: 5, userName: member.user.username});
            } else {
                GuildUserRepository.insert({
                    guildId: newGuild.id,
                    userId: newGuild.ownerId,
                    userName: member.user.username,
                    level: 5
                });
            }
    
            let highestRole = roles.find(role => role !== null);
            if (highestRole) {
                await member.roles.add(highestRole);
            }
    
            var owners = await GuildUserRepository.find({ where: { guildId: newGuild.id, level: 5 } });
            if (owners) {
                for (let owner of owners) {
                    if (owner.userId === newGuild.ownerId) continue;
                    GuildUserRepository.delete({ guildId: newGuild.id, userId: owner.userId });
                    let OwnerMember = await newGuild.members.fetch(owner.userId);
                    if (OwnerMember) {
                        OwnerMember.roles.remove(roles).catch(() => {});
                    }
                }
            }
        }
    }
}