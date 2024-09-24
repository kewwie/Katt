import { GuildCreate } from "./events/guildCreate";
import { GuildReady } from "./events/guildReady";
import { Ready } from "./events/ready";

export const ClientEvents = [
    GuildCreate,
    GuildReady,
    Ready
];