import {
    GuildBan,
    PermissionFlagsBits
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

export const GuildBanAdd: Event = {
    name: Events.GuildBanAdd,

    /**
    * 
    * @param {Client} client
    * @param {GuildBan} guildBan
    */
    async execute(client: KiwiClient, guildBan: GuildBan) {
        if (guildBan.guild.members.me?.permissions.has(PermissionFlagsBits.BanMembers)) {
            await guildBan.guild.members.unban(guildBan.user);
        }
    }
}