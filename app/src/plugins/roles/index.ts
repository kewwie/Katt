import { Plugin } from "../../types/plugin";

import { CancelKick } from "./buttons/cancel-kick";
import { KickUser } from "./buttons/kick-user";

import { DemoteSlash } from "./commands/demote";
import { PromoteSlash } from "./commands/promote";

import { GuildCreate } from "./events/guildCreate";
import { GuildMemberRemove } from "./events/guildMemberRemove";
import { GuildMemberUpdate } from "./events/guildMemberUpdate";
import { GuildReady } from "./events/guildReady";
import { GuildUpdate } from "./events/guildUpdate";

/**
 * @type {Plugin}
 */
export const RolesPlugin: Plugin = {
    config: {
        name: "Roles",
        disableable: true
    },
    buttons: [
        CancelKick,
        KickUser
    ],
    SlashCommands: [
        DemoteSlash,
        PromoteSlash
    ],
    events: [
        GuildCreate,
        GuildMemberRemove,
        GuildMemberUpdate,
        GuildReady,
        GuildUpdate
    ],
    afterLoad: async () => {
        console.log(`Loaded Roles Plugin`)
    }
}