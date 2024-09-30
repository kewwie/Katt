import { Module } from "../../types/module";

// Events
import { GuildCreate } from "./events/guildCreate";
import { GuildReady } from "./events/guildReady";

// Slash Commands
import { ConfigSlash } from "./commands/config";

// Select Menus
import { ConfigChannelSelectMenu } from "./selectmenus/configChannel";
import { ConfigRoleSelectMenu } from "./selectmenus/configRole";
import { ConfigSelectMenu } from "./selectmenus/config";

// Buttons
import { ConfigToggle } from "./buttons/configToggle";
import { ConfigCancel } from "./buttons/configCancel";
import { ConfigCommands } from "./buttons/configCommands";

export const ConfigModule: Module = {
    id: "config",
    events: [
        GuildCreate,
        GuildReady
    ],
    slashCommands: [
        ConfigSlash
    ],
    selectMenus: [
        ConfigChannelSelectMenu,
        ConfigRoleSelectMenu,
        ConfigSelectMenu
    ],
    buttons: [
        ConfigToggle,
        ConfigCancel,
        ConfigCommands
    ],
    default: true
}