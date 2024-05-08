import { Plugin } from "../../types/plugin";

import { AdminCmd } from "./commands/admin";
import { ConfigCmd } from "./commands/config";
import { PluginsCmd } from "./commands/plugins";

import { GuildAdminAdd } from "./events/guildAdminAdd";
import { GuildAdminRemove } from "./events/GuildAdminRemove";
import { GuildVerifiedAdd } from "./events/guildVerifiedAdd";
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
        GuildAdminAdd,
        GuildAdminRemove,
        GuildVerifiedAdd,
        Ready
    ],
    afterLoad: () => {
        console.log(`Loaded Admin Plugin`)
    }
}