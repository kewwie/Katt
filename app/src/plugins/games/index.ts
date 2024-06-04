import { Plugin } from "../../types/plugin";

import { ValorantCommand } from "./commands/valorant";

import { newMatchLoop } from "./loops/newMatch";

/**
 * @type {Plugin}
 */
export const GamesPlugin: Plugin = {
    config: {
        name: "Games",
        disableable: false
    },
    SlashCommands: [
        ValorantCommand
    ],
    loops: [
        newMatchLoop
    ],
    afterLoad: () => {
        console.log("Loaded Games Plugin")
    }
}