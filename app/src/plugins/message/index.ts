import { Plugin } from "../../types/plugin";

import { MessageCmd } from "./commands/message";

import { MessageCreate } from "./events/messageCreate";

/**
 * @type {Plugin}
 */
export const MessagePlugin: Plugin = {
    config: {
        name: "Message",
        disableable: true
    },
    commands: [
        MessageCmd
    ],
    events: [
        MessageCreate
    ],
    afterLoad: () => {
        console.log(`Loaded Message Plugin`)
    }
}