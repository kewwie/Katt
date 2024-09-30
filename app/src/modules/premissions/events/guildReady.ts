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

        var ownerLevel = await client.db.repos.memberLevels
            .findOneBy({ guildId: guild.id, userId: guild.ownerId });
        if (ownerLevel?.level < 1000) {
            await client.db.repos.memberLevels.save({
                guildId: guild.id,
                userId: guild.ownerId,
                level: 1000
            });
        }
    }
}