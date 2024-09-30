import { Guild } from "discord.js";
import { KiwiClient } from "../../../client";
import { EventList, Event } from "../../../types/event";

/**
 * @type {Event}
 */
export const GuildCreate: Event = {
    name: EventList.GuildCreate,

    /**
    * @param {Client} client
    * @param {Guild} guild
    */
    async execute(client: KiwiClient, guild: Guild) {
        await client.db.generateConfigs(guild.id);
    }
}