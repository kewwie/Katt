import { Plugin } from "../../types/plugin";

export const LogsPlugin: Plugin = {
    config: {
        name: "Logs"
    },
    afterLoad: () => {
        console.log(`Loaded Logs Plugin`)
    }
}