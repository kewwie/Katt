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
        let guildConfig = await client.DatabaseManager.getGuildConfig(guild.id);
        if (!guildConfig) {
            await client.DatabaseManager.createGuildConfig(guild.id);
        }

        var moduleIds = await client.DatabaseManager.getEnabledModules(guild.id);
        //await client.CommandManager.unregisterAll(guild.id);
        client.ModuleManager.register(guild.id);

        var ownerLevel = await client.DatabaseManager.getMemberLevel(guild.id, guild.ownerId);
        if (ownerLevel < 1000) {
            await client.DatabaseManager.setMemberLevel(guild.id, guild.ownerId, 1000);
        }
        console.log(`Guild "${guild.name}" Is Ready`);
    }
}