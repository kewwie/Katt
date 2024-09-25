import { KiwiClient } from "../client";

import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import { SlashCommand } from "../types/command";

/**
 * @type {SlashCommand}
 */
export const ListSlash: SlashCommand = {
    config: new SlashCommandBuilder()
        .setName("list")
        .setDescription("Manage lists")
        .addSubcommand(subcommand => 
            subcommand
                .setName("create")
                .setDescription("Create a list")
                .addStringOption(option => option
                    .setName("users")
                    .setDescription("Users to add to the list")
                    .setRequired(true)
                )
        ),
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {KiwiClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        await interaction.reply({ content: "ok" });
    },
}