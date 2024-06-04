import { Plugin } from "../../types/plugin";

import { VoiceSlash } from "./commands/voice";

import { GuildReady } from "./events/guildReady";
import { voiceStateUpdate } from "./events/voiceStateUpdate";

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
    events: [
        GuildReady,
        voiceStateUpdate
    ],
    afterLoad: () => {
        console.log(`Loaded Voice Plugin`)
    }
}