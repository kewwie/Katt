import { PermissionFlagsBits } from "discord-api-types/v10";
import { Guild } from "discord.js";
import { KiwiClient } from "../../../client";

import { Event, Events } from "../../../types/event";

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
    async execute(client: KiwiClient, guild: Guild): Promise<void> {
        if (guild.members.me?.permissions.has(PermissionFlagsBits.BanMembers)) {
            const bans = await guild.bans.fetch();
            if (bans.size > 0) {
                bans.forEach(ban => {
                    ban.guild.members.unban(ban.user);
                });
            }
        }
    }
}
