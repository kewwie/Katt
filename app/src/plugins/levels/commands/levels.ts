import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
} from "discord.js";

import { KiwiClient } from "../../../client";
import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
	Permissions,
	SlashCommand
} from "../../../types/command";

import { RowBuilder } from "../../../builders/row";

/**
 * @type {Command}
 */
export const LevelsSlash: SlashCommand = {
	config: {
        name: "levels",
        description: "Levels Commands",
        type: CommandTypes.CHAT_INPUT,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "view",
                description: "View your or someone else's level",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user you want to view the level of",
                        required: false
                    }
                ]
            }
        ]
    },

	/**
    * 
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient) {
        const user = interaction.options.getUser("user") || interaction.user;

        await interaction.reply({
            content: `**${user.username}** is level **${45}**`
        });		
	},
}