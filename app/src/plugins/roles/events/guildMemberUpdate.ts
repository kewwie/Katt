import {
    GuildMember
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildUserEntity } from "../../../entities/GuildUser";

/**
 * @type {Event}
 */
export const GuildMemberUpdate: Event = {
    name: Events.GuildMemberUpdate,

    /**
    * @param {Client} client
    * @param {GuildMember} oldMember
    * @param {GuildMember} newMember
    */
    async execute(client: KiwiClient, oldMember: GuildMember, newMember: GuildMember) {
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: newMember.guild.id } });
        let roles = [
            guildConfig.levelFive,
            guildConfig.levelFour,
            guildConfig.levelThree,
            guildConfig.levelTwo,
            guildConfig.levelOne
        ]

        if (guildConfig && roles.some(role => newMember.roles.cache.has(role))) {
            var isAdmin = await GuildUserRepository.findOne({ where: { guildId: newMember.guild.id, userId: newMember.id } });
            if (!isAdmin) {
                newMember.roles.remove(roles).catch(() => {});
            }
        }
    }
}