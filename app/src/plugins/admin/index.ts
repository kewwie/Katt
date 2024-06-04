import { Plugin } from "../../types/plugin";

import { AdminCmd } from "./commands/admin";
import { ConfigCmd } from "./commands/config";
import { PluginsCmd } from "./commands/plugins";

import { GuildAdminAdd } from "./events/guildAdminAdd";
import { GuildAdminRemove } from "./events/guildAdminRemove";
import { GuildCreate } from "./events/guildCreate";
import { GuildMemberUpdate } from "./events/guildMemberUpdate";
import { GuildVerifiedAdd } from "./events/guildVerifiedAdd";
import { Ready } from "./events/ready";

/**
 * @type {Plugin}
 */
export const AdminPlugin: Plugin = {
    config: {
        name: "Admin"
    },
    SlashCommands: [
        AdminCmd,
        ConfigCmd,
        PluginsCmd
    ],
    events: [
        GuildAdminAdd,
        GuildAdminRemove,
        GuildCreate,
        GuildMemberUpdate,
        GuildVerifiedAdd,
        Ready
    ],
    afterLoad: () => {
        console.log(`Loaded Admin Plugin`)
    }
}