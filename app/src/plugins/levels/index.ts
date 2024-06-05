import { Plugin } from "../../types/plugin";


import { MessageCreate } from "./events/messageCreate";

/**
 * @type {Plugin}
 */
export const LevelsPlugin: Plugin = {
    config: {
        name: "Levels",
        disableable: true
    },
    events: [
        MessageCreate
    ],
    afterLoad: () => {
        console.log("Loaded Levels Plugin")
    }
}