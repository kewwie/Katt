import { Plugin } from "../../types/plugin";

import { ValorantCmd } from "./commands/valorant";

import { newMatchLoop } from "./loops/newMatch";

export const GamesPlugin: Plugin = {
    config: {
        name: "Games",
        disableable: false
    },
    commands: [
       ValorantCmd
    ],
    loops: [
        newMatchLoop
    ],
    afterLoad: () => {
        console.log("Loaded Games Plugin")
    }
}