import {
    AnySelectMenuInteraction,
    ButtonBuilder,
    ButtonInteraction,
    RoleSelectMenuInteraction,
    UserSelectMenuInteraction,
    StringSelectMenuInteraction,
    ChannelSelectMenuInteraction,
    RoleSelectMenuBuilder,
    UserSelectMenuBuilder,
    StringSelectMenuBuilder,
    ChannelSelectMenuBuilder
} from "discord.js";
import { Module } from "./module";
import { KiwiClient } from "../client";

export interface SelectMenu {
    module?: Module;
    config: RoleSelectMenuBuilder | UserSelectMenuBuilder | StringSelectMenuBuilder | ChannelSelectMenuBuilder;
    execute: (interaction: AnySelectMenuInteraction | RoleSelectMenuInteraction | UserSelectMenuInteraction | StringSelectMenuInteraction | ChannelSelectMenuInteraction, client: KiwiClient) => Promise<void>;
}

export interface Button {
    module?: Module;
    config: ButtonBuilder;
    execute: (interaction: ButtonInteraction, client: KiwiClient) => Promise<void>;
}