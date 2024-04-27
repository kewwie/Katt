import { PermissionFlagsBits } from "discord-api-types/v10";
import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { AntiBanPlugin } from "..";

export const Ready: Event = {
    name: Events.Ready,
    once: true,
    manualCheck: true,

    /**
    * @param {KiwiClient} client
    */
    async execute(client: KiwiClient) {
        const guilds = await client.guilds.fetch();
        
        guilds.forEach(async (guild) => {
            var g = await guild.fetch();

            
            if (g.members.me?.permissions.has(PermissionFlagsBits.BanMembers)) {
                const bans = await g.bans.fetch();
                if (await client.getGuildPlugin(g.id, AntiBanPlugin.config.name)) {
                    if (bans.size > 0) {
                        bans.forEach(ban => {
                            ban.guild.members.unban(ban.user);
                        });
                    }
                }
            }
        });
    }
}
