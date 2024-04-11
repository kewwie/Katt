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
};