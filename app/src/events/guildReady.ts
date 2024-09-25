import { Guild } from "discord.js";
import { KiwiClient } from "../client";
import { Event, EventList } from "../types/event";

/**
 * @type {Event}
 */
export const GuildReady: Event = {
    name: EventList.GuildReady,

    /**
    * @param {KiwiClient} client
    * @param {Guild} guild
    */
    async execute(client: KiwiClient, guild: Guild) {
        await client.DatabaseManager.generateConfigs(guild.id);

        //await client.CommandManager.unregisterAll(guild.id);

        var ownerLevel = await client.DatabaseManager.getMemberLevel(guild.id, guild.ownerId);
        if (ownerLevel < 1000) {
            await client.DatabaseManager.setMemberLevel(guild.id, guild.ownerId, 1000);
        }
        console.log(`Guild "${guild.name}" Is Ready`);
    }
}