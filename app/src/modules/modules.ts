import { Module } from "../types/module";

// Modules Imports
import { ConfigModule } from "./config/module";
import { ActivityModule } from "./activity/module";
import { ListModule } from "./list/module";
import { PermissionsModule } from "./premissions/module";

export const ClientModules: Module[] = [
    ConfigModule,
    ActivityModule,
    ListModule,
    PermissionsModule
]