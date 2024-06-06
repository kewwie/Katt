import {
    Guild,
    GuildMember
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildAdminEntity } from "../../../entities/GuildAdmin";
import { GuildConfigEntity } from "../../../entities/GuildConfig";


/**
 * @type {Event}
 */
export const GuildVerifiedAdd: Event = {
    name: Events.GuildVerifiedAdd,

    /**
    * @param {KiwiClient} client
    * @param {Guild} user
    * @param {GuildMember} member
    */
    async execute(client: KiwiClient, guild: Guild, member: GuildMember) {
        const GuildAdminRepository = await dataSource.getRepository(GuildAdminEntity);
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        var g = await GuildConfigRepository.findOne({ where: { guildId: guild.id}});

        if (g && await GuildAdminRepository.findOne({ where: { guildId: guild.id, userId: member.id } })) {
            var guildMember = await guild.members.fetch(member.id);

            if (guildMember) {
                var adminRole = guildMember.roles.cache.find(role => role.id === g.adminRole);
                if (!adminRole) {
                    await guildMember.roles.add(g.adminRole).catch(() => {});
                }
            }
        }
    }
}
