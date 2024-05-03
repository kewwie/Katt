import { Plugin } from "../../types/plugin";
import { GuildBanAdd } from "./events/guildBanAdd";
import { Ready } from "./events/ready";

/**
 * Represents the AntiBan plugin.
 * @type {Plugin}
 */
export const AntiBanPlugin: Plugin = {
    /**
     * The configuration options for the AntiBan plugin.
     * @type {{ name: string, disableable: boolean }}
     */
    config: {
        /**
         * The name of the plugin.
         * @type {string}
         */
        name: "AntiBan",
        /**
         * Indicates whether the plugin can be disabled.
         * @type {boolean}
         */
        disableable: true
    },
    /**
     * The events that the AntiBan plugin listens to.
     * @type {Array<Function>}
     */
    events: [
        GuildBanAdd,
        Ready
    ],
    /**
     * A function that is executed after the AntiBan plugin is loaded.
     * @returns {void}
     */
    afterLoad: () => {
        console.log("Loaded AntiBan Plugin");
    }
}