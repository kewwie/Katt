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
        await client.db.generateConfigs(guild.id);

        //await client.CommandManager.unregisterAll(guild.id);

        var ownerLevel = await client.db.repos.memberLevels
            .findOneBy({ guildId: guild.id, userId: guild.ownerId });
        if (ownerLevel.level < 1000) {
            ownerLevel.level = 1000;
            await client.db.repos.memberLevels.save(ownerLevel);
        }

        console.log(`Guild "${guild.name}" Is Ready`);
    }
}