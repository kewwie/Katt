import { Guild } from "discord.js";

import { KiwiClient } from "../client";

export interface Loop {
    name: string;
    seconds: number;
    plugin?: string;
    execute: (client: KiwiClient, guild: Guild) => Promise<void>;
}