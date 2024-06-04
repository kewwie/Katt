import { Plugin } from "../../types/plugin";

import { UpdateList } from "./buttons/update-list";
import { ListSlash } from "./commands/list";

/**
 * @type {Plugin}
 */
export const ListPlugin: Plugin = {
    config: {
        name: "List",
        disableable: true
    },
    buttons: [
        UpdateList
    ],
    SlashCommands: [
        ListSlash
    ],
    afterLoad: () => {
        console.log("Loaded List Plugin")
    }
}