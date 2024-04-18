import { Plugin } from "../../types/plugin";

import { GuildMemberUpdate } from "./events/guildMemberUpdate";

export const LogsPlugin: Plugin = {
    config: {
        name: "Logs"
    },
    events: [
        GuildMemberUpdate
    ],
    afterLoad: () => {
        console.log(`Loaded Logs Plugin`)
    }
}