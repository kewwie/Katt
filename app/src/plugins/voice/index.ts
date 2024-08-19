import { Plugin } from "../../types/plugin";

import { VoiceSlash } from "../../slash/voice";
import { JoinedSlash } from "../../slash/joined";

import { VoiceActivityUser } from "../../slash/voice-activity";

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
        VoiceSlash,
        JoinedSlash
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