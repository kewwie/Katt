import { Plugin } from "../../types/plugin";

import { ValorantCmd } from "./commands/valorant";

export const GamesPlugin: Plugin = {
    config: {
        name: "Games"
    },
    commands: [
       ValorantCmd
    ],
    afterLoad: () => {
        console.log("Loaded Games Plugin")
    }
}