import { Plugin } from "../../types/plugin";

export const ConfigPlugin: Plugin = {
    config: {
        name: "Config"
    },
    afterLoad: () => {
        console.log("Loaded Config Plugin")
    }
}