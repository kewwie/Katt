import { Plugin } from "../../types/plugin";

import { VoiceCmd } from "./commands/voice";

import { Ready } from "./events/ready";
import { voiceStateUpdate } from "./events/voiceStateUpdate";

export const VoicePlugin: Plugin = {
    config: {
        name: "Voice",
        disableable: true
    },
    commands: [
        VoiceCmd
    ],
    events: [
        Ready,
        voiceStateUpdate
    ],
    afterLoad: () => {
        console.log(`Loaded Voice Plugin`)
    }
}