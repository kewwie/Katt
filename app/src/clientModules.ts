import { Module } from "./types/module";

// Slash Commands
import { ConfigSlash } from "./slash/config";
import { ActivitySlash } from "./slash/activity";

// Select Menus
import { ConfigChannelSelectMenu } from "./selectmenus/configChannel";
import { ConfigSelectMenu } from "./selectmenus/config";
import { ActivitySelectMenu } from "./selectmenus/activity";

// Buttons
import { ConfigToggle } from "./buttons/configToggle";
import { ConfigCancel } from "./buttons/configCancel";
import { ConfigCommands } from "./buttons/configCommands";

export const ClientModules: Module[] = [
    {
        id: "root",
        name: "Root",
        description: "All of the main commands that are required for the bot to function.",
        slashCommands: [
            ConfigSlash
        ],
        selectMenus: [
            ConfigChannelSelectMenu,
            ConfigSelectMenu
        ],
        buttons: [
            ConfigToggle,
            ConfigCancel,
            ConfigCommands
        ],
        global: true,
        hidden: true
    },
    {
        id: "activity",
        name: "Activity",
        description: "The activity module allows you to view the activity of a user.",
        slashCommands: [
            ActivitySlash
        ],
        selectMenus: [
            ActivitySelectMenu
        ],
        global: false,
        hidden: false
    }
]