import { Plugin } from "../../types/plugin";
import { AcceptInvite } from "./buttons/accept-invite";
import { DenyInvite } from "./buttons/deny-invite";

import { GroupCommand } from "./commands/group";
import { GuildMemberUpdate } from "./events/guildMemberUpdate";
import { GuildReady } from "./events/guildReady";

/**
 * @type {Plugin}
 */
export const GroupsPlugin: Plugin = {
    config: {
        name: "Groups",
        disableable: true
    },
    buttons: [
        AcceptInvite,
        DenyInvite
    ],
    SlashCommands: [
        GroupCommand
    ],
    events: [
        GuildMemberUpdate,
        GuildReady
    ],
    afterLoad: async () => {
        console.log("Loaded Groups Plugin")
    }
}