import { Module } from "../../types/module";

// Events
import { GuildCreate } from "./events/guildCreate";
import { GuildReady } from "./events/guildReady";

// Slash Commands
import { ConfigSlash } from "./commands/config";

// Select Menus
import { ConfigChannelSelectMenu } from "./selectmenus/configChannel";
import { ConfigRoleSelectMenu } from "./selectmenus/configRole";
import { ConfigSelectMenu } from "./selectmenus/configType";

// Buttons
import { ConfigToggleButton } from "./buttons/configToggle";
import { ModuleInfoButton } from "./buttons/moduleInfo";
import { ConfigCancelButton } from "./buttons/configCancel";

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
        ConfigToggleButton,
        ModuleInfoButton,
        ConfigCancelButton
    ],
    default: true
}