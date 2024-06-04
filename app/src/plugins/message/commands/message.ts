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

import { dataSource } from "../../../data/datasource";
import { MessageActivity } from "../../../data/entities/MessageActivity";

/**
 * @type {SlashCommand}
 */
export const MessageSlash: SlashCommand = {
	config: {
        name: "message",
        description: "Message Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: null,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "activity",
                description: "View a users message activity",
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
                description: "View the message leaderboard",
            }
        ]
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        const MessageActivityRepository = await dataSource.getRepository(MessageActivity);

        switch (interaction.options.getSubcommand()) {
            case "activity": {
                var user = interaction.options.getUser("user") || interaction.user;
                if (!user) {
                    interaction.reply("User not found");
                    return;
                } 

                var messageActivity = await MessageActivityRepository.findOne(
                    { where: { userId: user.id, guildId: interaction.guild.id } }
                );

                if (!messageActivity || messageActivity.messages < 0) {
                    interaction.reply("No voice activity found for this user");
                    return;
                }
                
                
                var uTag= await client.getTag({ username: user.username, discriminator: user.discriminator });
                interaction.reply(`**${uTag}** has sent **${new Intl.NumberFormat("en-US").format(Math.floor(messageActivity.messages))}** ${messageActivity.messages === 1 ? 'message' : 'messages'} in the server`);
                break;
            }
            case "leaderboard": {
                var messageActivities = await MessageActivityRepository.find(
                    { where: { guildId: interaction.guild.id }, order: { messages: "DESC" }, take: 10 }
                );

                var leaderboard = messageActivities.map((ma, i) => {
                    return `${i + 1}. **${ma.username}** - ${new Intl.NumberFormat("en-US").format(Math.floor(ma.messages))} ${ma.messages === 1 ? 'message' : 'messages'}`;
                }).join("\n");

                interaction.reply(`**Message Leaderboard**\n${leaderboard}`);
                break;
            }
        }
    }
}