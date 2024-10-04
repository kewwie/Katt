import { KiwiClient } from "../../../client";

import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    StringSelectMenuBuilder
} from "discord.js";
import { SlashCommand } from "../../../types/command";

import { ActivitySelectMenu } from "../selectmenus/activityType";
import { sendVoiceLeaderboard } from "../utils/sendVoiceLeaderboard";
import { getPage } from "../utils/getPage";

/**
 * @type {SlashCommand}
 */
export const ActivitySlash: SlashCommand = {
    config: new SlashCommandBuilder()
        .setName("activity")
        .setDescription("View your's or someone else activity"),
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {KiwiClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        var page = await getPage(client, { 
            guildId: interaction.guildId,
            pageId: "status",
            pageOwner: interaction.user
        });
        interaction.reply({ embeds: [...page.embeds], components: [...page.rows] });
    },
}