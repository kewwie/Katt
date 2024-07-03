import { Plugin } from "../../types/plugin";

import { ConfigSlash } from "./commands/config";
import { PluginSlash } from "./commands/plugin";

/**
 * @type {Plugin}
 */
export const DefaultPlugin: Plugin = {
    config: {
        name: "Default"
    },
    SlashCommands: [
        ConfigSlash,
        PluginSlash
    ],
    afterLoad: async () => {
        console.log(`Loaded Default Plugin`)
    }
}