import {
    Guild
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { GuildAdmins } from "../../../data/entities/GuildAdmins";

/**
 * @type {Event}
 */
export const GuildCreate: Event = {
    name: Events.GuildCreate,

    /**
    * @param {Client} client
    * @param {Guild} guild
    */
    async execute(client: KiwiClient, guild: Guild) {
        const GuildAdminsRepository = await dataSource.getRepository(GuildAdmins);

        var isAdmin = await GuildAdminsRepository.findOne({ where: { guildId: guild.id, userId: guild.ownerId } });

        if (!isAdmin) {
            var user = await client.users.fetch(guild.ownerId);
            await GuildAdminsRepository.insert({
                guildId: guild.id,
                userId: user.id,
                level: 4,
                username: user.username
            });
        }
    }
}