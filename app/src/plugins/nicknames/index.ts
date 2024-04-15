import { Plugin } from "../../types/plugin";

import { NicknameCmd } from "./commands/nickname";

import { GuildMemberUpdate } from "./events/guildMemberUpdate";

export const NicknamesPlugin: Plugin = {
    config: {
        name: "Nickname"
    },
    commands: [
        NicknameCmd
    ],
    events: [
        GuildMemberUpdate
    ],
    afterLoad: () => {
        console.log("Loaded Nicknames Plugin")
    }
}