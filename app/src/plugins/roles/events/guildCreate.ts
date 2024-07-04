import { Guild } from "discord.js";
import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildUserEntity } from "../../../entities/GuildUser";

import { GetHighestRole } from "../functions/getHighestRole";

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
        var roles = {
            1: guildConfig?.levelOne,
            2: guildConfig?.levelTwo,
            3: guildConfig?.levelThree,
            4: guildConfig?.levelFour,
            5: guildConfig?.levelFive
        };

        var isUser = await GuildUserRepository.findOne({
            where: {
                guildId: guild.id,
                userId: guild.ownerId
            }
        });
        var member = await guild.members.fetch(guild.ownerId).catch(() => {});
        if (member) {
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
            await member.roles.add((await GetHighestRole(isUser.level, roles)));
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
    }
}