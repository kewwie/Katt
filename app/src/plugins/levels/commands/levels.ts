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
	SlashCommand
} from "../../../types/command";

import { dataSource } from "../../../datasource";
import { UserLevel } from "../../../entities/UserLevel";

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
        const UserLevelRepository = await dataSource.getRepository(UserLevel);

        var user = interaction.options.getUser("user") || interaction.user;

        var LevelUser = await UserLevelRepository.findOne({ where: { guildId: interaction.guild.id, userId: user.id } });
        if (LevelUser) {
            await interaction.reply(`**${user.username}** is level **${LevelUser.level}**`);
        } else {
            interaction.reply(`**${user.username}** has not gained any xp yet`);
        }	
	},
}