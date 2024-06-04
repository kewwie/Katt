import { Plugin } from "../../types/plugin";

import { GuildReady } from "./events/guildReady";

/**
 * @type {Plugin}
 */
export const LevelsPlugin: Plugin = {
    config: {
        name: "Levels",
        disableable: false
    },
    events: [
        GuildReady
    ],
    afterLoad: () => {
        console.log("Loaded Levels Plugin")
    }
}