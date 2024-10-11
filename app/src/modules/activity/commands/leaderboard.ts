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
        .setDescription("View server leaderboards")
        .addStringOption(option =>
            option 
                .setName("type")
                .setDescription("The leaderboard type")
                .setRequired(false)
                .addChoices(
                    { name: "Voice", value: "voice" },
                    { name: "Message", value: "message" }
                )
        )
        .addStringOption(option =>
            option 
                .setName("time")
                .setDescription("The leaderboard time")
                .setRequired(false)
                .addChoices(
                    { name: "Total", value: "total" },
                    { name: "Daily", value: "daily" },
                    { name: "Weekly", value: "weekly" },
                    { name: "Monthly", value: "monthly" }
                )
        ),
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {KiwiClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        var type = interaction.options.getString("type") || "voice";
        var time = interaction.options.getString("time") || "total";

        var page = await getLeaderboardPage(client, { 
            guildId: interaction.guildId,
            pageId: type,
            time: time,
            pageOwner: interaction.user
        });
        interaction.reply({ content: page.content, components: [...page.rows] });
    },
}