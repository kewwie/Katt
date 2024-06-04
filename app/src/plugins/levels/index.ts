import { Plugin } from "../../types/plugin";

/**
 * @type {Plugin}
 */
export const LevelsPlugin: Plugin = {
    config: {
        name: "Levels",
        disableable: false
    },
    afterLoad: () => {
        console.log("Loaded Levels Plugin")
    }
}