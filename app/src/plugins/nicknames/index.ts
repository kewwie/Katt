import { Plugin } from "../../types/plugin";

export const NicknamePlugin: Plugin = {
    config: {
        name: "Nickname"
    },
    commands: [
        
    ],
    afterLoad: () => {
        console.log("Loaded Nickname Plugin")
    }
}