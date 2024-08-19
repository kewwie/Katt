import {
	ChatInputCommandInteraction
} from "discord.js";

import { KiwiClient } from "../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
    SlashCommand
} from "../types/command";

import { dataSource } from "../datasource";
import { VoiceActivityEntity } from "../entities/VoiceActivity";

/**
 * @type {SlashCommand}
 */
export const VoiceCommand: SlashCommand = {
    pluginName: "Voice",
	config: {
        name: "voice",
        description: "Voice Commands",
        type: CommandTypes.ChatInput,
        defaultMemberPermissions: null,
        contexts: [SlashCommandContexts.Guild],
        integration_types: [IntegrationTypes.Guild],
        options: [
            {
                type: OptionTypes.SubCommand,
                name: "activity",
                description: "View a users voice chat activity",
                options: [
                    {
                        type: OptionTypes.User,
                        name: "user",
                        description: "The user you want to check the activity of",
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SubCommand,
                name: "leaderboard",
                description: "View the voice chat leaderboard",
            }
        ]
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        const vl = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        });

        const vaf = new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 0
        });

        switch (interaction.options.getSubcommand()) {
            case "activity": {
                var user = interaction.options.getUser("user") || interaction.user;
                if (!user) {
                    interaction.reply("User not found");
                    return;
                } 

                var voiceActivity = await client.DatabaseManager.getVoiceActivity(interaction.guild.id, user.id);

                if (!voiceActivity || voiceActivity.seconds < 0) {
                    interaction.reply("No voice activity found for this user");
                    return;
                }
        
                var timeSeconds = voiceActivity.seconds;
                var days, hours, minutes, seconds;
        
                days = Math.floor(timeSeconds / (24 * 60 * 60));
                timeSeconds %= 24 * 60 * 60;
        
                hours = Math.floor(timeSeconds / (60 * 60));
                timeSeconds %= 60 * 60;
        
                minutes = Math.floor(timeSeconds / 60);
                seconds = timeSeconds % 60;
        
                interaction.reply(`**${client.capitalize(voiceActivity.userName)}** has been in voice chat for **${vaf.format(days)}** days **${vaf.format(hours)}** hours **${vaf.format(minutes)}** minutes and **${vaf.format(seconds)}** seconds.`);
                break;
            }
            case "leaderboard": {
                var voiceActivities = await client.DatabaseManager.getVoiceActivityLeaderboard(interaction.guildId);

                var leaderboard = voiceActivities.map((va, i) => {
                    return `${i + 1}. **${client.capitalize(va.userName)}** - ${vl.format(va.seconds / (60 * 60))} hours`;
                }).join("\n");

                interaction.reply(`## Voice Leaderboard\n${leaderboard}`);
                break;
            }
        }
    }
}