import { Plugin } from "../../types/plugin";

import { ApproveGuest } from "./buttons/approve-guest";
import { ApproveMember } from "./buttons/approve-member";
import { DenyUser } from "./buttons/deny-user";
import { GuildMemberAdd } from "./events/guildMemberAdd";

/**
 * @type {Plugin}
 */
export const VerificationPlugin: Plugin = {
    config: {
        name: "Verification",
        disableable: true
    },
    buttons: [
        ApproveGuest,
        ApproveMember,
        DenyUser
    ],
    events: [
        GuildMemberAdd
    ],
    afterLoad: () => {
        console.log("Loaded Verification Plugin")
    }
}