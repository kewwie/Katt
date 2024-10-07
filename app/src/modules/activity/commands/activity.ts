import { KiwiClient } from "../../../client";

import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    StringSelectMenuBuilder
} from "discord.js";
import { SlashCommand } from "../../../types/command";

import { getPage } from "../utils/getPage";

/**
 * @type {SlashCommand}
 */
export const ActivitySlash: SlashCommand = {
    config: new SlashCommandBuilder()
        .setName("activity")
        .setDescription("View your's or someone else activity")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user to view")
                .setRequired(false)
        ),
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {KiwiClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        var user = interaction.options.getUser("user") || interaction.user;
        var page = await getPage(client, { 
            guildId: interaction.guildId,
            pageId: "status",
            pageOwner: interaction.user,
            user
        });
        interaction.reply({ embeds: [...page.embeds], components: [...page.rows] });
    },
}