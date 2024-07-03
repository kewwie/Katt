import { GuildMember } from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildUserEntity } from "../../../entities/GuildUser";

/**
 * @type {Event}
 */
export const GuildMemberRemove: Event = {
    name: Events.GuildMemberRemove,

    /**
     * @param {GuildMember} member
     */
    async getGuildId(member: GuildMember) {
        return member.guild.id;
    },

    /**
    * @param {Client} client
    * @param {GuildMember} member
    */
    async execute(client: KiwiClient, member: GuildMember) {
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        var isAdmin = (await GuildUserRepository.findOne({ where: { guildId: member.guild.id, userId: member.id } })).level >= 3;

        if (!isAdmin) {
            GuildUserRepository.delete({ guildId: member.guild.id, userId: member.id });
        }
    }
}