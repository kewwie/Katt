import { Plugin } from "../../types/plugin";

import { NicknameCmd } from "./commands/nickname";

import { GuildMemberAdd } from "./events/guildMemberAdd";
import { GuildMemberUpdate } from "./events/guildMemberUpdate";

export const NicknamesPlugin: Plugin = {
    config: {
        name: "Nickname",
        disableable: true
    },
    commands: [
        NicknameCmd
    ],
    events: [
        GuildMemberAdd,
        GuildMemberUpdate
    ],
    afterLoad: () => {
        console.log("Loaded Nicknames Plugin")
    }
}