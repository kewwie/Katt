import { Plugin } from "../../types/plugin";

import { VoiceSlash } from "./commands/voice";

import { VoiceActivityUser } from "./commands/voice-activity";

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
    SlashCommands: [
        VoiceSlash
    ],
    UserCommands: [
        VoiceActivityUser
    ],
    events: [
        GuildReady,
        VoiceStateUpdate
    ],
    afterLoad: async () => {
        console.log(`Loaded Voice Plugin`)
    }
}