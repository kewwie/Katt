import { Plugin } from "../../types/plugin";

/**
 * @type {Plugin}
 */
export const LevelsPlugin: Plugin = {
    config: {
        name: "Levels",
        disableable: true
    },
    afterLoad: () => {
        console.log("Loaded Levels Plugin")
    }
}