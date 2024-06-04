import { Plugin } from "../../types/plugin";
import { AcceptInvite } from "./buttons/accept-invite";
import { DenyInvite } from "./buttons/deny-invite";

import { GroupCommand } from "./commands/group";
import { GuildMemberUpdate } from "./events/guildMemberUpdate";
import { GuildVerifiedAdd } from "./events/guildVerifiedAdd";
import { Ready } from "./events/ready";

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
        GuildVerifiedAdd,
        Ready
    ],
    afterLoad: () => {
        console.log("Loaded Groups Plugin")
    }
}