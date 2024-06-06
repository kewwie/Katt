import { Plugin } from "../../types/plugin";

/**
 * @type {Plugin}
 */
export const CustomVoicePlugin: Plugin = {
    config: {
        name: "CustomVoice",
        disableable: true
    },
    afterLoad: () => {
        console.log(`Loaded Custom Voice Plugin`)
    }
}