import { Plugin } from "../../types/plugin";

import { ConfigCmd } from "./commands/config";
import { PluginsCmd } from "./commands/plugins";

export const ConfigPlugin: Plugin = {
    config: {
        name: "Config"
    },
    commands: [
        ConfigCmd,
        PluginsCmd
    ],
    afterLoad: () => {
        console.log("Loaded Config Plugin")
    }
}