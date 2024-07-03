import {
    Guild
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildUserEntity } from "../../../entities/GuildUser";

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
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);

        var isOwner = await GuildUserRepository.findOne({ where: { guildId: guild.id, userId: guild.ownerId, level: 5 } });

        if (!isOwner) {
            var user = await client.users.fetch(guild.ownerId);
            isOwner.guildId = guild.id;
            isOwner.userId = user.id;
            isOwner.userName = user.username;
            isOwner.level = 5;
            await GuildUserRepository.save(isOwner);
        }
    }
}