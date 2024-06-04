import { KiwiClient } from "../client";
import { Event } from "../types/event";

import { dataSource } from "../data/datasource";
import { GuildPlugins } from "../data/entities/GuildPlugins";

export class EventManager {
    private client: KiwiClient;

    constructor(client: KiwiClient) {
        this.client = client;
    }

    load(events: Event[]) {
        for (let event of events) {
            this.client.events.set(event.name, event);

            this.client.on(event.name, async (...args: any[]) => {
                var plugin = this.client.PluginManager.plugins.find(plugin => plugin.config.name === event.plugin);

                if (plugin.config.disableable) {
                    const GuildPluginsRepository = await dataSource.getRepository(GuildPlugins);
                    if (await GuildPluginsRepository.findOne({ where: { guild_id: (await event.getGuildId(...args)), plugin: event.plugin } })) {
                        event.execute(this.client, ...args);
                    }
                    
                } else {
                    event.execute(this.client, ...args);
                }
            });
        }
    }
};