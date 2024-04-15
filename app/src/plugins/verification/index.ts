import { Plugin } from "../../types/plugin";

import { AcceptGuest } from "./buttons/accept-guest";
import { AcceptMember } from "./buttons/accept-member";
import { DenyUser } from "./buttons/deny-user";

import { Whitelist } from "./commands/whitelist";

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
        Whitelist
    ],
    events: [
        GuildMemberAdd
    ],
    afterLoad: () => {
        console.log("Loaded Verification Plugin")
    }
}