import { Plugin } from "../../types/plugin";

import { GroupCommand } from "./commands/group";

/**
 * @type {Plugin}
 */
export const GroupsPlugin: Plugin = {
    config: {
        name: "Groups",
        disableable: true
    },
    commands: [
        GroupCommand
    ],
    afterLoad: () => {
        console.log("Loaded Groups Plugin")
    }
}