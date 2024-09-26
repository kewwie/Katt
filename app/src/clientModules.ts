import { Module } from "./types/module";

// Slash Commands
import { ConfigSlash } from "./slash/config";
import { ActivitySlash } from "./slash/activity";
import { ListSlash } from "./slash/list";

// Select Menus
import { ConfigChannelSelectMenu } from "./selectmenus/configChannel";
import { ConfigRoleSelectMenu } from "./selectmenus/configRole";
import { ConfigSelectMenu } from "./selectmenus/config";
import { ActivitySelectMenu } from "./selectmenus/activity";

// Buttons
import { ConfigToggle } from "./buttons/configToggle";
import { ConfigCancel } from "./buttons/configCancel";
import { ConfigCommands } from "./buttons/configCommands";
import { UpdateListButton } from "./buttons/updateList";

// Schedules
import { ActivityDailySchedule } from "./schedules/activity-daily";
import { ActivityWeeklySchedule } from "./schedules/activity-weekly";
import { ActivityMonthlySchedule } from "./schedules/activity-monthly";

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