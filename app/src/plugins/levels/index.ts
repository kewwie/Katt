import { Plugin } from "../../types/plugin";

import { LevelsSlash } from "./commands/levels";

import { MessageCreate } from "./events/messageCreate";

/**
 * @type {Plugin}
 */
export const LevelsPlugin: Plugin = {
    config: {
        name: "Levels",
        disableable: true
    },
    SlashCommands: [
        LevelsSlash
    ],
    events: [
        MessageCreate
    ],
    afterLoad: () => {
        console.log("Loaded Levels Plugin")
    }
}