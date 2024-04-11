import { KiwiClient } from "../client";
import { Command } from "./command";
import { Event } from "./event";

export interface Plugin {
    config: {
        name: string,
        description?: string,
        global?: boolean,
    },
    commands?: Command[],
    events?: Event[],
    beforeLoad?: (client: KiwiClient) => void,
    afterLoad?: (client: KiwiClient) => void,
    beforeUnload?: (client: KiwiClient) => void,
    afterUnload?: (client: KiwiClient) => void,
}