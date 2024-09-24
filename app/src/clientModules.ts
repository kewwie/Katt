import { Module } from "./types/module";

import { ConfigSlash } from "./slash/config";
import { ActivitySlash } from "./slash/activity";

export const ClientModules: Module[] = [
    {
        id: "root",
        name: "Root",
        description: "All of the main commands that are required for the bot to function.",
        slashCommands: [
            ConfigSlash
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
        global: false,
        hidden: false
    }
]