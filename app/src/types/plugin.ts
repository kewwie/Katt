import { KiwiClient } from "../client";
import { SlashCommand, UserCommand } from "./command";
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
    UserCommands?: UserCommand[],
    PrefixCommands?: [],
    events?: Event[],
    loops?: Loop[],
    beforeLoad?: (client: KiwiClient) => Promise<void>,
    afterLoad?: (client: KiwiClient) => Promise<void>,
    beforeUnload?: (client: KiwiClient) => Promise<void>,
    afterUnload?: (client: KiwiClient) => Promise<void>,
}