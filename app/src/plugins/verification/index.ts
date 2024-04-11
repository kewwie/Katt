import { Plugin } from "../../types/plugin";

import { Whitelist } from "./commands/whitelist";

import { GuildMemberAdd } from "./events/guildMemberAdd";

export const Verification: Plugin = {
    config: {
        name: "Verification"
    },
    commands: [
        Whitelist
    ],
    events: [
        GuildMemberAdd
    ],
    afterLoad: () => {
        console.log("Loaded Utility")
    }
}