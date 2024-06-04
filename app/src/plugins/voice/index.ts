import { Plugin } from "../../types/plugin";

import { VoiceSlash } from "./commands/voice";

import { Ready } from "./events/ready";
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
        Ready,
        voiceStateUpdate
    ],
    afterLoad: () => {
        console.log(`Loaded Voice Plugin`)
    }
}