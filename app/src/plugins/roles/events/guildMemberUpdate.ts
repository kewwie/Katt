import { GuildMember } from "discord.js";
import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildUserEntity } from "../../../entities/GuildUser";
import { GetHighestRole } from "../functions/getHighestRole";

/**
 * @type {Event}
 */
export const GuildMemberUpdate: Event = {
    name: Events.GuildMemberUpdate,

    /**
     * @param {Guild} guild
     */
    async getGuildId(member: GuildMember) {
        return member.guild.id;
    },

    /**
    * @param {Client} client
    * @param {GuildMember} oldMember
    * @param {GuildMember} newMember
    */
    async execute(client: KiwiClient, oldMember: GuildMember, newMember: GuildMember) {
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: newMember.guild.id } });
        var user = await GuildUserRepository.findOne({ where: { guildId: newMember.guild.id, userId: newMember.id } });

        var roles = {
            1: guildConfig.levelOne,
            2: guildConfig.levelTwo,
            3: guildConfig.levelThree,
            4: guildConfig.levelFour,
            5: guildConfig.levelFive
        };
        
        var highestRole = await GetHighestRole(user?.level, roles);
        if (!newMember.roles.cache.has(highestRole)) newMember.roles.add(highestRole).catch(() => {});
        for (let roleId of Object.values(roles)) {
            if (roleId !== highestRole && newMember.roles.cache.has(roleId)) {
                newMember.roles.remove(roleId).catch(() => {});
            }
        }
    }
}