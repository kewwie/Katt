import { KiwiClient } from "../client";
import { Plugin } from "./plugin";

import { Guild } from "discord.js";

export interface Loop {
    name: string;
    seconds: number;
    plugin?: Plugin;
    execute: (client: KiwiClient, guild: Guild) => Promise<void>;
}