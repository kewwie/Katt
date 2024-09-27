import { KiwiClient } from "../client";
import { Event, EventList } from "../types/event";

import { ClientModules } from "../clientModules";

/**
 * @type {Event}
 */
export const Ready: Event = {
    name: EventList.Ready,

    /**
    * @param {KiwiClient} client
    */
    async execute(client: KiwiClient) {
        console.log(`${client.user?.username} is Online`);
        for (let guild of await client.guilds.fetch()) {
            client.emit(EventList.GuildReady, await guild[1].fetch());
        }

        for (let module of ClientModules) {
            client.ModuleManager.load(module);
        }
        
        client.ModuleManager.register(
            [
                ...client.CommandManager.SlashCommands.values(),
                ...client.CommandManager.UserCommands.values(),
            ]
        );
    }
}