import { Plugin } from "../../types/plugin";

import { ApproveGuest } from "./buttons/approve-guest";
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
        DenyUser
    ],
    events: [
        GuildMemberAdd
    ],
    afterLoad: async () => {
        console.log("Loaded Verification Plugin")
    }
}