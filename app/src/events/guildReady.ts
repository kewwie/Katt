import { Guild } from "discord.js";
import { KiwiClient } from "../client";
import { Event, Events } from "../types/event";

/**
 * @type {Event}
 */
export const GuildReady: Event = {
    name: Events.GuildReady,

    /**
     * @param {Guild} guild
     */
    async getGuildId(guild: Guild) {
        return guild.id;
    },

    /**
    * @param {KiwiClient} client
    * @param {Guild} guild
    */
    async execute(client: KiwiClient, guild: Guild) {
        let guildConfig = await client.DatabaseManager.getGuildConfig(guild.id);
        if (!guildConfig) {
            await client.DatabaseManager.createGuildConfig(guild.id);
        }
        console.log(`Guild ${guild.name} is ready`);
    }
}