import { Plugin } from "../../types/plugin";

import { GuildBanAdd } from "./events/guildBanAdd";
import { Ready } from "./events/ready";

export const AntiBan: Plugin = {
    config: {
        name: "AntiBan"
    },
    events: [
        GuildBanAdd,
        Ready
    ],
    afterLoad: () => {
        console.log("Loaded AntiBan Plugin")
    }
}