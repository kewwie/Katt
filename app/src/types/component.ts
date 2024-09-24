import { StringSelectMenuBuilder } from "discord.js";
import { Module } from "./module";
import { KiwiClient } from "../client";

export interface SelectMenu {
    module?: Module;
    config: StringSelectMenuBuilder;
    execute: (interaction: any, client: KiwiClient) => Promise<void>;
}