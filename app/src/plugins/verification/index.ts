import { Plugin } from "../../types/plugin";

import { Whitelist } from "./commands/whitelist";

export const Verification: Plugin = {
    config: {
        name: "Verification"
    },
    commands: [
        Whitelist
    ],
    afterLoad: () => {
        console.log("Loaded Utility")
    }
}