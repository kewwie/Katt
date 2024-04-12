import { KiwiClient } from "../client";
import { Command } from "./command";
import { Button } from "./component";
import { Event } from "./event";

export interface Plugin {
    config: {
        name: string,
        description?: string
    },
    buttons?: Button[],
    commands?: Command[],
    events?: Event[],
    beforeLoad?: (client: KiwiClient) => void,
    afterLoad?: (client: KiwiClient) => void,
    beforeUnload?: (client: KiwiClient) => void,
    afterUnload?: (client: KiwiClient) => void,
}