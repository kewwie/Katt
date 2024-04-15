import { Plugin } from "../../types/plugin";

import { AcceptGuest } from "./buttons/accept-guest";
import { AcceptMember } from "./buttons/accept-member";
import { DenyUser } from "./buttons/deny-user";
import { BlacklistCmd } from "./commands/blacklist";

import { WhitelistCmd } from "./commands/whitelist";

import { GuildMemberAdd } from "./events/guildMemberAdd";

export const VerificationPlugin: Plugin = {
    config: {
        name: "Verification"
    },
    buttons: [
        AcceptGuest,
        AcceptMember,
        DenyUser
    ],
    commands: [
        BlacklistCmd,
        WhitelistCmd
    ],
    events: [
        GuildMemberAdd
    ],
    afterLoad: () => {
        console.log("Loaded Verification Plugin")
    }
}