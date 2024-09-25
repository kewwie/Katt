import { Guild } from "discord.js";
import { KiwiClient } from "../client";
import { EventList, Event } from "../types/event";

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
        await client.DatabaseManager.generateConfigs(guild.id);
        await client.DatabaseManager.setMemberLevel(guild.id,guild.ownerId, 1000);
        console.log(`Guild ${guild.name} has been created`);
    }
}