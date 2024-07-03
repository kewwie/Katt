import { Plugin } from "../../types/plugin";

import { ApproveUser } from "./buttons/approve-user";
import { DenyUser } from "./buttons/deny-user";

import { BlacklistSlash } from "./commands/blacklist";
import { VerifySlash } from "./commands/verify";

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
        ApproveUser,
        DenyUser
    ],
    SlashCommands: [
        BlacklistSlash,
        VerifySlash
    ],
    events: [
        GuildMemberAdd
    ],
    afterLoad: async () => {
        console.log("Loaded Verification Plugin")
    }
}