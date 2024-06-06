import { GuildMember } from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { NicknameEntity } from "../../../entities/Nickname";

/**
 * @type {Event}
 */
export const GuildMemberUpdate: Event = {
    name: Events.GuildMemberUpdate,

    /**
     * @param {GuildMember} member
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
        const NicknameRepository = await dataSource.getRepository(NicknameEntity);

        if (newMember.nickname && oldMember.nickname !== newMember.nickname) {
            await NicknameRepository.upsert({
                guildId: newMember.guild.id,
                userId: newMember.id,
                name: newMember.nickname
            }, ["guildId", "userId"])
        }
    }
}