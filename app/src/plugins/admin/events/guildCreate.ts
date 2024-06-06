import {
    Guild
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildAdminEntity } from "../../../entities/GuildAdmin";

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
        const GuildAdminRepository = await dataSource.getRepository(GuildAdminEntity);

        var isAdmin = await GuildAdminRepository.findOne({ where: { guildId: guild.id, userId: guild.ownerId } });

        if (!isAdmin) {
            var user = await client.users.fetch(guild.ownerId);
            await GuildAdminRepository.insert({
                guildId: guild.id,
                userId: user.id,
                level: 4,
                userName: user.username
            });
        }
    }
}