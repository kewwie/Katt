import { Plugin } from "../../types/plugin";

import { MessageSlash } from "./commands/message";

import { MessageCreate } from "./events/messageCreate";

/**
 * @type {Plugin}
 */
export const MessagePlugin: Plugin = {
    config: {
        name: "Message",
        disableable: true
    },
    SlashCommands: [
        MessageSlash
    ],
    events: [
        MessageCreate
    ],
    afterLoad: async () => {
        console.log(`Loaded Message Plugin`)
    }
}