import { KiwiClient } from "../../../client";

import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import { SlashCommand } from "../../../types/command";

import { getLeaderboardPage } from "../utils/getLeaderboardPage";

/**
 * @type {SlashCommand}
 */
export const LeaderboardSlash: SlashCommand = {
    config: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("View server leaderboards"),
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {KiwiClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        var user = interaction.options.getUser("user") || interaction.user;
        var page = await getLeaderboardPage(client, { 
            guildId: interaction.guildId,
            pageId: "voice",
            time: "total",
            pageOwner: interaction.user,
            user
        });
        interaction.reply({ content: page.content, components: [...page.rows] });
    },
}