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
    customId: string;
    config?: RoleSelectMenuBuilder | UserSelectMenuBuilder | StringSelectMenuBuilder | ChannelSelectMenuBuilder;
    execute: (interaction: AnySelectMenuInteraction | RoleSelectMenuInteraction | UserSelectMenuInteraction | StringSelectMenuInteraction | ChannelSelectMenuInteraction, options: CustomOptions, client: KiwiClient) => Promise<void>;
}

export interface Button {
    module?: Module;
    customId: string;
    config?: ButtonBuilder;
    execute: (interaction: ButtonInteraction, options: CustomOptions, client: KiwiClient) => Promise<void>;
}

export interface CustomOptions {
    customId: string;
    optionOne?: string;
    optionTwo?: string;
    ownerId?: string;
}