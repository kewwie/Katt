import { Plugin } from "../../types/plugin";

/**
 * @type {Plugin}
 */
export const DefaultPlugin: Plugin = {
    config: {
        name: "Developer",
        description: "Developer Plugin",
        staffOnly: true,
        staffServer: true,
        hidden: true
    },
    SlashCommands: [
    ],
    afterLoad: async () => {
        console.log(`Loaded Developer Plugin`)
    }
}