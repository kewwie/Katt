import { Plugin } from "../../types/plugin";

import { ConfigCmd } from "./commands/config";
import { PluginsCmd } from "./commands/plugins";

/**
 * Represents the Config Plugin.
 */
export const ConfigPlugin: Plugin = {
    /**
     * The configuration object for the plugin.
     */
    config: {
        name: "Config"
    },
    /**
     * The list of commands provided by the plugin.
     */
    commands: [
        ConfigCmd,
        PluginsCmd
    ],
    /**
     * A callback function that is executed after the plugin is loaded.
     * @returns A Promise that resolves when the plugin is fully loaded.
     */
    afterLoad: () => {
        console.log("Loaded Config Plugin");
    }
}