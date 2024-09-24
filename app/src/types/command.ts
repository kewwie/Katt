import { KiwiClient } from "../client";
import { Module } from "./module";

import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    Message
} from "discord.js";

export interface PrefixCommand {
    module?: Module;
    level?: number;
    config: {
        name: string;
        description?: string;
    };
    execute: (message: Message, commandOptions: CommandOptions, client: KiwiClient) => Promise<void>;
}

export interface CommandOptions {
    commandName: string;
    auther: string;
    args: string[];
}

export interface UserCommand {
    module?: Module;
    level?: number;
    config: {
        type: CommandTypes.User;
        name: string;
    };
    execute: (interaction, client: KiwiClient) => Promise<void>;
}

export interface SlashCommand {
    module?: Module;
    level?: number;
    config: SlashCommandBuilder;
    autocomplete?: (interaction: AutocompleteInteraction, client: KiwiClient) => Promise<void>;
    execute: (interaction: ChatInputCommandInteraction, client: KiwiClient) => Promise<void>;
}

export enum CommandTypes {
    ChatInput = 1,
    User = 2,
    Message = 3
}
