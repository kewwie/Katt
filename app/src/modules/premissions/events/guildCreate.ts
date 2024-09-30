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
        var owner = await guild.members.fetch(guild.ownerId);
        var ownerLevel = await client.db.repos.memberLevels
            .findOneBy({ guildId: guild.id, userId: owner.id });

        if (!ownerLevel?.level || ownerLevel.level < 1000) {
            await client.db.repos.memberLevels.save({
                guildId: guild.id,
                userId: owner.id,
                userName: owner.user.username,
                level: 1000
            });
        }
    }
}