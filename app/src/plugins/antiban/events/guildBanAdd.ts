import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import {
    GuildBan,
    PermissionFlagsBits
} from "discord.js";

/**
 * Represents the GuildBanAdd event.
 * @type {Event}
 */
export const GuildBanAdd: Event = {
    name: Events.GuildBanAdd,

    /**
     * Executes the GuildBanAdd event.
     * @param {KiwiClient} client - The KiwiClient instance.
     * @param {GuildBan} guildBan - The GuildBan object representing the banned user and guild.
     * @returns {Promise<void>}
     */
    async execute(client: KiwiClient, guildBan: GuildBan): Promise<void> {
        if (guildBan.guild.members.me?.permissions.has(PermissionFlagsBits.BanMembers)) {
            await guildBan.guild.members.unban(guildBan.user);
        }
    }
}