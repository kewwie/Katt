import { Module } from "../../types/module";

// Events
import { VoiceStateUpdate } from "./events/voiceStateUpdate";

// Slash Commands
import { ActivitySlash } from "./commands/activity";
import { LeaderboardSlash } from "./commands/leaderboard";

// Select Menus
import { ActivitySelectMenu } from "./selectmenus/activityType";
import { LeaderboardTypeSelectMenu } from "./selectmenus/leaderboardType";
import { LeaderboardTimeSelectMenu } from "./selectmenus/leaderboardTime";

// Schedules
import { ActivityDailySchedule } from "./schedules/activity-daily";
import { ActivityWeeklySchedule } from "./schedules/activity-weekly";
import { ActivityMonthlySchedule } from "./schedules/activity-monthly";

export const ActivityModule: Module = {
    id: "activity",
    events: [
        VoiceStateUpdate
    ],
    slashCommands: [
        ActivitySlash,
        LeaderboardSlash
    ],
    selectMenus: [
        ActivitySelectMenu,
        LeaderboardTypeSelectMenu,
        LeaderboardTimeSelectMenu
    ],
    schedules: [
        ActivityDailySchedule,
        ActivityWeeklySchedule,
        ActivityMonthlySchedule
    ]
}