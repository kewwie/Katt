import { Plugin } from "../../types/plugin";

import { VoiceCmd } from "./commands/voice";

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
        voiceStateUpdate
    ],
    afterLoad: () => {
        console.log(`Loaded Message Plugin`)
    }
}