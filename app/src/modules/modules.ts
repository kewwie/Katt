import { Module } from "../types/module";

// Modules Imports
import { ConfigModule } from "./config/module";
import { ActivityModule } from "./activity/module";
import { ListModule } from "./list/module";

export const ClientModules: Module[] = [
    ConfigModule,
    ActivityModule,
    ListModule
]