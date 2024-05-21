import {
	ChatInputCommandInteraction
} from "discord.js";

import { KiwiClient } from "../../../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
    Command
} from "../../../types/command";

import { dataSource } from "../../../data/datasource";
import { VoiceActivity } from "../../../data/entities/VoiceActivity";

/**
 * @type {Command}
 */
export const VoiceCmd: Command = {
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
        const VoiceActivityRepository = await dataSource.getRepository(VoiceActivity);

        const formatter = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
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
                
                
                var uTag= await client.getTag({ username: user.username, discriminator: user.discriminator });
                var hours = voiceActivity.seconds / (60 * 60);
                interaction.reply(`**${uTag}** has been in voice chat for **${formatter.format(hours)}** hours`);
                break;
            }
            case "leaderboard": {
                var voiceActivities = await VoiceActivityRepository.find(
                    { where: { guildId: interaction.guild.id }, order: { seconds: "DESC" }, take: 10 }
                );

                var leaderboard = voiceActivities.map((va, i) => {
                    return `${i + 1}. **${va.username}** - ${formatter.format(va.seconds / (60 * 60))} hours`;
                }).join("\n");

                interaction.reply(`**Voice Chat Leaderboard**\n${leaderboard}`);
                break;
            }
        }
    }
}