import { KiwiClient } from "../client";
import { SlashCommand } from "./command";
import { Button } from "./component";
import { Event } from "./event";
import { Loop } from "./loop";


export interface Plugin {
    config: {
        name: string,
        description?: string,
        disableable?: boolean,
    },
    buttons?: Button[],
    SlashCommands?: SlashCommand[],
    PrefixCommands?: [],
    events?: Event[],
    loops?: Loop[],
    beforeLoad?: (client: KiwiClient) => void,
    afterLoad?: (client: KiwiClient) => void,
    beforeUnload?: (client: KiwiClient) => void,
    afterUnload?: (client: KiwiClient) => void,
}