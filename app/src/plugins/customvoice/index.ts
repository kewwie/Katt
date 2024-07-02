import { Plugin } from "../../types/plugin";

import { ChannelUpdate } from "./events/channelUpdate";
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
        ChannelUpdate,
        GuildReady,
        VoiceStateUpdate
    ],
    loops: [
        DeleteChannels
    ],
    afterLoad: async () => {
        console.log(`Loaded Custom Voice Plugin`)
    }
}