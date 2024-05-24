import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import { AntiBanPlugin } from "..";

import {
    GuildBan,
    PermissionFlagsBits
} from "discord.js";

/**
 * @type {Event}
 */
export const GuildBanAdd: Event = {
    name: Events.GuildBanAdd,

    /**
     * @param {KiwiClient} client
     * @param {GuildBan} guildBan
     */
    async execute(client: KiwiClient, guildBan: GuildBan): Promise<void> {
        if (await client.getGuildPlugin(guildBan.guild.id, AntiBanPlugin.config.name)) {
            if (guildBan.guild.members.me?.permissions.has(PermissionFlagsBits.BanMembers)) {
                await guildBan.guild.members.unban(guildBan.user);
            }
        }
    }
}