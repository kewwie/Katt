import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

export const Ready: Event = {
    name: Events.Ready,
    once: true,

    /**
    * @param {KiwiClient} client
    */
    async execute(client: KiwiClient) {
        console.log(`${client.user?.username} is Online`);
    }
}
