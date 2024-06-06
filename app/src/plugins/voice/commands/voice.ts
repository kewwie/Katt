import {
	ChatInputCommandInteraction
} from "discord.js";

import { KiwiClient } from "../../../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
    SlashCommand
} from "../../../types/command";

import { dataSource } from "../../../datasource";
import { VoiceActivityEntity } from "../../../entities/VoiceActivity";

/**
 * @type {SlashCommand}
 */
export const VoiceSlash: SlashCommand = {
	config: {
        name: "voice",
        description: "Voice Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: null,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "activity",
                description: "View a users voice chat activity",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user you want to check the activity of",
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
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
        const VoiceActivityRepository = await dataSource.getRepository(VoiceActivityEntity);

        const formatter = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        });

        switch (interaction.options.getSubcommand()) {
            case "activity": {
                var user = interaction.options.getUser("user") || interaction.user;
                if (!user) {
                    interaction.reply("User not found");
                    return;
                } 

                var voiceActivity = await VoiceActivityRepository.findOne(
                    { where: { userId: user.id, guildId: interaction.guild.id } }
                );

                if (!voiceActivity || voiceActivity.seconds < 0) {
                    interaction.reply("No voice activity found for this user");
                    return;
                }
                
                var hours = voiceActivity.seconds / (60 * 60);
                interaction.reply(`**${voiceActivity.userName}** has been in voice chat for **${formatter.format(hours)}** hours`);
                break;
            }
            case "leaderboard": {
                var voiceActivities = await VoiceActivityRepository.find(
                    { where: { guildId: interaction.guild.id }, order: { seconds: "DESC" }, take: 10 }
                );

                var leaderboard = voiceActivities.map((va, i) => {
                    return `${i + 1}. **${va.userName}** - ${formatter.format(va.seconds / (60 * 60))} hours`;
                }).join("\n");

                interaction.reply(`**Voice Leaderboard**\n${leaderboard}`);
                break;
            }
        }
    }
}