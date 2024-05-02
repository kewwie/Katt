import { Plugin } from "../../types/plugin";

import { VoiceCmd } from "./commands/voice";

import { Ready } from "./events/ready";
import { voiceStateUpdate } from "./events/voiceStateUpdate";

export const MessagePlugin: Plugin = {
    config: {
        name: "Message",
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
        console.log(`Loaded Message Plugin`)
    }
}