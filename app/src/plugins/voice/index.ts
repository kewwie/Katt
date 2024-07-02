import { Plugin } from "../../types/plugin";

import { VoiceSlash } from "./commands/voice";

import { GuildReady } from "./events/guildReady";
import { VoiceStateUpdate } from "./events/voiceStateUpdate";

/**
 * @type {Plugin}
 */
export const VoicePlugin: Plugin = {
    config: {
        name: "Voice",
        disableable: true
    },
    ApplicationCommands: [
        VoiceSlash
    ],
    events: [
        GuildReady,
        VoiceStateUpdate
    ],
    afterLoad: async () => {
        console.log(`Loaded Voice Plugin`)
    }
}