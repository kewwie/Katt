import { OAuth2Guild } from "discord.js";

import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

/**
 * @type {Event}
 */
export const GuildReady: Event = {
    name: Events.GuildReady,

    /**
    * @param {KiwiClient} client
    */
    async execute(client: KiwiClient, guild: OAuth2Guild) {
        console.log("Ready event fired");
        console.log(guild.name);
        console.log(guild, client);
    }
}