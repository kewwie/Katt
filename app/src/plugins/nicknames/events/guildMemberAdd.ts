import {
	ButtonBuilder,
	ActionRowBuilder,
    EmbedBuilder,
    GuildMember,
    TextChannel
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { Nickname } from "../../../data/entities/Nickname";

import { NicknamesPlugin } from "..";

/**
 * @type {Event}
 */
export const GuildMemberAdd: Event = {
    name: Events.GuildMemberAdd,

    /**
     * @param {GuildMember} member
     */
    async getGuildId(member: GuildMember) {
        return member.guild.id;
    },

    /**
    * 
    * @param {KiwiClient} client
    * @param {GuildMember} member
    */
    async execute(client: KiwiClient, member: GuildMember) {
        const NicknameRepository = await dataSource.getRepository(Nickname);

        var m = await NicknameRepository.findOne(
            { where: { userId: member.id, guildId: member.guild.id } }
        );
        if (m) {
            member.setNickname(m.nickname);
        }
    }
}
