import { Plugin } from "../../types/plugin";
import { GuildBanAdd } from "./events/guildBanAdd";
import { GuildReady } from "./events/guildReady";

/**
 * @type {Plugin}
 */
export const AntiBanPlugin: Plugin = {
    config: {
        name: "AntiBan",
        disableable: true
    },
    events: [
        GuildBanAdd,
        GuildReady
    ],
    afterLoad: () => {
        console.log("Loaded AntiBan Plugin");
    }
}