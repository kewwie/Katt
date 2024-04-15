import { Plugin } from "../../types/plugin";

import { ConfigCmd } from "./commands/config";

export const ConfigPlugin: Plugin = {
    config: {
        name: "Config"
    },
    commands: [
        ConfigCmd
    ],
    afterLoad: () => {
        console.log("Loaded Config Plugin")
    }
}