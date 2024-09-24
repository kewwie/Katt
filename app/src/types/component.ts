import { 
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    ButtonBuilder,
    ButtonInteraction
} from "discord.js";
import { Module } from "./module";
import { KiwiClient } from "../client";

export interface SelectMenu {
    module?: Module;
    config: StringSelectMenuBuilder;
    execute: (interaction: StringSelectMenuInteraction, client: KiwiClient) => Promise<void>;
}

export interface Button {
    module?: Module;
    config: ButtonBuilder;
    execute: (interaction: ButtonInteraction, client: KiwiClient) => Promise<void>;
}