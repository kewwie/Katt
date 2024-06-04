import { Plugin } from "../../types/plugin";

import { NicknameSlash } from "./commands/nickname";

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
    events: [
        GuildMemberAdd,
        GuildMemberUpdate
    ],
    afterLoad: () => {
        console.log("Loaded Nicknames Plugin")
    }
}