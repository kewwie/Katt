import { Module } from "../../types/module";

// Events
import { GuildCreate } from "./events/guildCreate";
import { GuildReady } from "./events/guildReady";

export const PermissionsModule: Module = {
    id: "permissions",
    events: [
        GuildCreate,
        GuildReady
    ]
}