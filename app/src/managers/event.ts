import { KiwiClient } from "../client";
import { Event } from "../types/event";

export class EventManager {
    private client: KiwiClient;

    constructor(client: KiwiClient) {
        this.client = client;
    }

    load(events: Event[]) {
        for (let event of events) {
            this.client.events.set(event.name, event);

            if (event.once) {
                this.client.once(event.name, (...args: any[]) => event.execute(this.client, ...args));
            } else {
                this.client.on(event.name, (...args: any[]) => event.execute(this.client, ...args));
            }
        }
    }

    async executeEvent(event: Event, ...args: any[]) {
        //const GuildPluginsRepository = await dataSource.getRepository(GuildPlugins);

        if (event.plugin) {
            if (!this.client.PluginManager.plugins.find(plugin => plugin.config.name === event.plugin).config.disableable) {
                event.execute(this.client, ...args);
            } else {
                if (args[0].guild.id) {
                    //var status = await GuildPluginsRepository.findOne({ where: { guild_id: args[0].guild.id, plugin: event.plugin } });
                    //console.log(status)
                
                }
            }
        }
    }
};