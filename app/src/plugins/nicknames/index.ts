import { Plugin } from "../../types/plugin";

import { NicknameCmd } from "./commands/nickname";

import { GuildMemberAdd } from "../verification/events/guildMemberAdd";

export const NicknamePlugin: Plugin = {
    config: {
        name: "Nickname"
    },
    commands: [
        NicknameCmd
    ],
    events: [
        GuildMemberAdd
    ],
    afterLoad: () => {
        console.log("Loaded Nickname Plugin")
    }
}