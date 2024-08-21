import { Guild } from "discord.js";
import { KiwiClient } from "../client";
import { Events, Event } from "../types/event";

/**
 * @type {Event}
 */
export const GuildCreate: Event = {
    name: Events.GuildCreate,

    /**
     * @param {Guild} guild
     */
    async getGuildId(guild: Guild) {
        return guild.id;
    },

    /**
    * @param {Client} client
    * @param {Guild} guild
    */
    async execute(client: KiwiClient, guild: Guild) {
        await client.DatabaseManager.createGuildConfig(guild.id);
        console.log(`Guild ${guild.name} has been created`);
    }
}