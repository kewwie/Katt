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
            const guildAdmin = await GuildAdminsRepository.findOne({ where: { guildId: guild[0], userId: g.ownerId } });

            if (!guildAdmin) {
                const newGuildAdmin = new GuildAdmins();
                newGuildAdmin.guildId = guild[0];
                newGuildAdmin.userId = g.ownerId;
                await GuildAdminsRepository.save(newGuildAdmin);
            }
        }
    }
}