import { KiwiClient } from "../client";
import { Module } from "./module";

export interface Schedule {
    module?: Module;
    rule: object;
    execute: (client: KiwiClient, guildId: string) => void;
}