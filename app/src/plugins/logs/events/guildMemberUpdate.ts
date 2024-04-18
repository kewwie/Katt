import { GuildMember } from "discord.js";

import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../data/datasource";

export const GuildMemberUpdate: Event = {
    name: Events.GuildMemberUpdate,

    /**
    * @param {KiwiClient} client
    * @param {GuildMember} oldMember
    * @param {GuildMember} newMember
    * @returns {Promise<void>}
    */
    async execute(client: KiwiClient, oldMember: GuildMember, newMember: GuildMember) {
        // Do something with the oldMember and newMember
    }
}