import {
    Guild,
    User,
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildAdmins } from "../../../entities/GuildAdmins";
import { GuildConfig } from "../../../entities/GuildConfig";

/**
 * @type {Event}
 */
export const GuildAdminAdd: Event = {
    name: Events.GuildAdminAdd,

    /**
    * @param {KiwiClient} client
    * @param {Guild} user
    * @param {User} user
    */
    async execute(client: KiwiClient, guild: Guild, user: User) {
        const GuildRepository = await dataSource.getRepository(GuildConfig);

        var g = await GuildRepository.findOne({ where: { guildId: guild.id}});
        var guildMember = await guild.members.fetch(user.id);

        if (g && guildMember) {
            var adminRole = guildMember.roles.cache.find(role => role.id === g.adminRole);
            if (!adminRole) {
                await guildMember.roles.add(g.adminRole).catch(() => {});
            }
        }
    }
}
