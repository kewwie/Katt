import { Plugin } from "../../types/plugin";

import { AdminCmd } from "./commands/admin";
import { ConfigCmd } from "./commands/config";
import { PluginsCmd } from "./commands/plugins";

import { GuildAdminAdd } from "./events/guildAdminAdd";
import { GuildAdminRemove } from "./events/guildAdminRemove";
import { GuildCreate } from "./events/guildCreate";
import { GuildMemberUpdate } from "./events/guildMemberUpdate";
import { GuildVerifiedAdd } from "./events/guildVerifiedAdd";
import { GuildReady } from "./events/guildReady";

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
        GuildReady
    ],
    afterLoad: () => {
        console.log(`Loaded Admin Plugin`)
    }
}