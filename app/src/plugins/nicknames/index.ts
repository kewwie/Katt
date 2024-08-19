import { Plugin } from "../../types/plugin";

import { NicknameSlash } from "../../slash/nickname";

import { SaveNicknameUser } from "../../slash/save-nickname";

import { GuildMemberAdd } from "./events/guildMemberAdd";
import { GuildMemberUpdate } from "./events/guildMemberUpdate";

/**
 * @type {Plugin}
 */
export const NicknamesPlugin: Plugin = {
    config: {
        name: "Nickname",
        disableable: true
    },
    SlashCommands: [
        NicknameSlash
    ],
    UserCommands: [
        SaveNicknameUser
    ],
    events: [
        GuildMemberAdd,
        GuildMemberUpdate
    ],
    afterLoad: async () => {
        console.log("Loaded Nicknames Plugin")
    }
}