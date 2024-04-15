import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

export const Ready: Event = {
    name: Events.Ready,
    once: true,

    /**
    * @param {KiwiClient} client
    */
    async execute(client: KiwiClient) {
        const guilds = client.guilds.cache;
        guilds.forEach(async (guild) => {
            const bans = await guild.bans.fetch();
            if (bans.size > 0) {
                bans.forEach(ban => {
                    ban.guild.members.unban(ban.user);
                });
            }
        });
    }
}
