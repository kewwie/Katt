import { Plugin } from "../../types/plugin";
import { AcceptInvite } from "./buttons/accept-invite";
import { DenyInvite } from "./buttons/deny-invite";

import { GroupCommand } from "./commands/group";
import { GuildVerifiedAdd } from "./events/guildVerifiedAdd";

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
    commands: [
        GroupCommand
    ],
    events: [
        GuildVerifiedAdd
    ],
    afterLoad: () => {
        console.log("Loaded Groups Plugin")
    }
}