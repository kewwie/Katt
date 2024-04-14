import { Plugin } from "../../types/plugin";

export const Groups: Plugin = {
    config: {
        name: "Groups"
    },
    afterLoad: () => {
        console.log("Loaded Groups Plugin")
    }
}