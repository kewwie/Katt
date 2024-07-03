import { Plugin } from "../../types/plugin";

import { PromoteSlash } from "./commands/promote";

import { GuildCreate } from "./events/guildCreate";

/**
 * @type {Plugin}
 */
export const RolesPlugin: Plugin = {
    config: {
        name: "Roles",
        disableable: true
    },
    SlashCommands: [
        PromoteSlash
    ],
    events: [
        GuildCreate
    ],
    afterLoad: async () => {
        console.log(`Loaded Roles Plugin`)
    }
}