import { Plugin } from "../../types/plugin";

import { UpdateList } from "./buttons/update-list";
import { List } from "./commands/list";

export const ListPlugin: Plugin = {
    config: {
        name: "List",
        disableable: true
    },
    buttons: [
        UpdateList
    ],
    commands: [
        List
    ],
    afterLoad: () => {
        console.log("Loaded List Plugin")
    }
}