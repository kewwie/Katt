import { Module } from "./types/module";

// Slash Commands
import { ConfigSlash } from "./slash/config";
import { ActivitySlash } from "./modules/activity/commands/activity";
import { ListSlash } from "./slash/list";

// Select Menus
import { ConfigChannelSelectMenu } from "./modules/root/selectmenus/configChannel";
import { ConfigRoleSelectMenu } from "./modules/root/selectmenus/configRole";
import { ConfigSelectMenu } from "./modules/root/selectmenus/config";
import { ActivitySelectMenu } from "./modules/root/selectmenus/activity";

// Buttons
import { ConfigToggle } from "./modules/root/buttons/configToggle";
import { ConfigCancel } from "./modules/root/buttons/configCancel";
import { ConfigCommands } from "./modules/root/buttons/configCommands";
import { UpdateListButton } from "./buttons/updateList";

// Schedules
import { ActivityDailySchedule } from "./modules/activity/schedules/activity-daily";
import { ActivityWeeklySchedule } from "./modules/activity/schedules/activity-weekly";
import { ActivityMonthlySchedule } from "./modules/activity/schedules/activity-monthly";

export const ClientModules: Module[] = [
    {
        id: "root",
        name: "Root",
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
    },
    {
        id: "activity",
        name: "Activity",
        slashCommands: [
            ActivitySlash
        ],
        selectMenus: [
            ActivitySelectMenu
        ],
        schedules: [
            ActivityDailySchedule,
            ActivityWeeklySchedule,
            ActivityMonthlySchedule
        ]
    },
    {
        id: "list",
        name: "List",
        slashCommands: [
            ListSlash
        ],
        buttons: [
            UpdateListButton
        ]
    }
]