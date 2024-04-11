import { KiwiClient } from "../client";
import { Command } from "./command";

export interface Plugin {
    config: {
        name: string,
        description?: string,
        global?: boolean,
    },
    commands?: Command[],
    beforeLoad?: (client: KiwiClient) => void,
    afterLoad?: (client: KiwiClient) => void,
    beforeUnload?: (client: KiwiClient) => void,
    afterUnload?: (client: KiwiClient) => void,
}