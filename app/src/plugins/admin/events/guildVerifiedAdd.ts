import {
    Guild,
    GuildMember
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { GuildAdmins } from "../../../data/entities/GuildAdmins";
import { GuildConfig } from "../../../data/entities/GuildConfig";


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
        const GuildAdminsRepository = await dataSource.getRepository(GuildAdmins);
        const GuildRepository = await dataSource.getRepository(GuildConfig);
        var g = await GuildRepository.findOne({ where: { guildId: guild.id}});

        if (g && await GuildAdminsRepository.findOne({ where: { guildId: guild.id, userId: member.id } })) {
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
