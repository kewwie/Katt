import { KiwiClient } from "./client";
import { Event } from "./types/event";

export class EventManager {
    private client: KiwiClient;

    constructor(client: KiwiClient) {
        this.client = client;
    }

    load(event: Event) {
        this.client.Events.set(event.name, event);
    }

    register(events: Event[]) {
        for (let event of events) {
            this.client.on(event.name, async (...args: any[]) => {
                event.execute(this.client, ...args);
            });
        }
    }
};