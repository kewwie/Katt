import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { GuildAdmins } from "../../../data/entities/GuildAdmins";

export const Ready: Event = {
    name: Events.Ready,
    once: true,

    /**
    * @param {KiwiClient} client
    */
    async execute(client: KiwiClient) {
        const GuildAdminsRepository = await dataSource.getRepository(GuildAdmins)
        
        for (var guild of await client.guilds.fetch()) {
            var g = await guild[1].fetch();

            await GuildAdminsRepository.upsert(
                {
                    guildId: guild[0],
                    userId: g.ownerId,
                    level: 4
                }, ['guildId', 'userId']
            )
        }
    }
}