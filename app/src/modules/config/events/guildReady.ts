import { Guild } from "discord.js";
import { KiwiClient } from "../../../client";
import { Event, EventList } from "../../../types/event";

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
        await client.db.generateConfigs(guild.id);

        console.log(`Guild ${guild.name} is ready!`);
    }
}