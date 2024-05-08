import { Plugin } from "../../types/plugin";

import { AdminCmd } from "./commands/admin";
import { ConfigCmd } from "./commands/config";
import { PluginsCmd } from "./commands/plugins";
import { Ready } from "./events/ready";

export const AdminPlugin: Plugin = {
    config: {
        name: "Admin"
    },
    commands: [
        AdminCmd,
        ConfigCmd,
        PluginsCmd
    ],
    events: [
        Ready
    ],
    afterLoad: () => {
        console.log(`Loaded Admin Plugin`)
    }
}