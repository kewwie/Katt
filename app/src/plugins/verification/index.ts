import { Plugin } from "../../types/plugin";

import { ApproveGuest } from "./buttons/approve-guest";
import { ApproveMember } from "./buttons/approve-member";
import { DenyUser } from "./buttons/deny-user";

import { BlacklistCmd } from "./commands/blacklist";
import { WhitelistCmd } from "./commands/whitelist";

import { GuildMemberAdd } from "./events/guildMemberAdd";

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
    commands: [
        //BlacklistCmd,
        //WhitelistCmd
    ],
    events: [
        //GuildMemberAdd
    ],
    afterLoad: () => {
        console.log("Loaded Verification Plugin")
    }
}