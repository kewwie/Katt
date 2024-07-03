import {
    GuildMember
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildAdminEntity } from "../../../entities/GuildUser";

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
        const GuildAdminRepository = await dataSource.getRepository(GuildAdminEntity);
        var g = await GuildConfigRepository.findOne({ where: { guildId: newMember.guild.id } });

        if (g && newMember.roles.cache.has(g.adminRole)) {
            var isAdmin = await GuildAdminRepository.findOne({ where: { guildId: newMember.guild.id, userId: newMember.id } });
            if (!isAdmin) {
                await newMember.roles.remove(g.adminRole).catch(() => {});
            }
        }
    }
}