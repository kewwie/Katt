import { Plugin } from "../../types/plugin";

import { PluginSlash } from "./commands/plugin";

/**
 * @type {Plugin}
 */
export const DefaultPlugin: Plugin = {
    config: {
        name: "Default",
        hidden: true
    },
    SlashCommands: [
        PluginSlash
    ],
    afterLoad: async () => {
        console.log(`Loaded Default Plugin`)
    }
}