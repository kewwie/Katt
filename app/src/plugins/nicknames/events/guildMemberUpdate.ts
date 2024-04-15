import {
    GuildMember
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { Nickname } from "../../../data/entities/Nickname";

export const GuildMemberUpdate: Event = {
    name: Events.GuildMemberUpdate,

    /**
    * @param {Client} client
    * @param {GuildMember} oldMember
    * @param {GuildMember} newMember
    */
    async execute(client: KiwiClient, oldMember: GuildMember, newMember: GuildMember) {
        const NicknameRepository = await dataSource.getRepository(Nickname);
        if (oldMember.nickname !== newMember.nickname) {
            await NicknameRepository.upsert({
                guildId: newMember.guild.id,
                userId: newMember.id,
                nickname: newMember.nickname
            }, ["guildId", "userId"])
        }
    }
}