import { Collection } from "discord.js";
import { KiwiClient } from "./client";
import { Event, EventList } from "./types/event";

import { ClientModules } from "./modules/modules";

export class EventManager {
    private client: KiwiClient;
    public Events: Collection<string, Event[]>;

    constructor(client: KiwiClient) {
        this.client = client;
        this.Events = new Collection();
        this.client.on(EventList.Ready, this.onReady);     
    }

    private async onReady(client: KiwiClient) {
        console.log(`${client.user?.username} is Online`);
        for (let guild of await client.guilds.fetch()) {
            client.emit(EventList.GuildReady, await guild[1].fetch());
        }

        for (let module of ClientModules) {
            client.ModuleManager.load(module);
        }
        
        client.ModuleManager.registerCommands(
            [
                ...client.CommandManager.SlashCommands.values(),
                ...client.CommandManager.UserCommands.values(),
            ]
        );
    }

    load(event: Event) {
        var EventArray = this.Events.get(event.name);
        console.log(EventArray);
    }

    register(events: Event[]) {
        for (let event of events) {
            this.client.on(event.name, async (...args: any[]) => {
                event.execute(this.client, ...args);
            });
        }
    }
};