import { Plugin } from "../../types/plugin";
import { GuildBanAdd } from "./events/guildBanAdd";
import { Ready } from "./events/ready";

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
        Ready
    ],
    afterLoad: () => {
        console.log("Loaded AntiBan Plugin");
    }
}