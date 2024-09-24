import { KiwiClient } from "../client";

import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    StringSelectMenuBuilder
} from "discord.js";
import { SlashCommand } from "../types/command";

import { ActivitySelectMenu } from "../selectmenus/activity";

/**
 * @type {SlashCommand}
 */
export const ActivitySlash: SlashCommand = {
    config: new SlashCommandBuilder()
        .setName("activity")
        .setDescription("Manage the bot activity"),
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {KiwiClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {

        var SelectMenu = ActivitySelectMenu.config.setCustomId(`activity-type+${interaction.user.id}`);
        var row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(SelectMenu);

        interaction.reply({ content: "Select the activity type", components: [row] });
    },
}