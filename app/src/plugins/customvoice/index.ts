import { Plugin } from "../../types/plugin";

import { GuildReady } from "./events/guildReady";
import { VoiceStateUpdate } from "./events/voiceStateUpdate";

import { DeleteChannels } from "./loops/delateChannels";

/**
 * @type {Plugin}
 */
export const CustomVoicePlugin: Plugin = {
    config: {
        name: "CustomVoice",
        disableable: true
    },
    events: [
        GuildReady,
        VoiceStateUpdate
    ],
    loops: [
        DeleteChannels
    ],
    afterLoad: () => {
        console.log(`Loaded Custom Voice Plugin`)
    }
}