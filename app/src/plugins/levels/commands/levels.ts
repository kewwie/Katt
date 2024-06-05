import {
	ChatInputCommandInteraction,
    EmbedBuilder
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
            var username = user.username.charAt(0).toUpperCase() + user.username.slice(1);
            var levelRank = (await UserLevelRepository.find({ where: { guildId: interaction.guild.id }, order: { xp: "DESC" } })).findIndex(u => u.userId === user.id)
            var LevelEmbed = new EmbedBuilder()
                .setThumbnail(user.displayAvatarURL())
                .setDescription(`# ${username}\n* **Rank: #${levelRank}**\n* **Level: ${LevelUser.level}**\n* **XP: ${LevelUser.userXp}/${LevelUser.levelXp}**`)
                .setColor("#2b2d31")

            interaction.reply({ embeds: [LevelEmbed] });
        } else {
            interaction.reply(`**${user.username}** has not gained any xp yet`);
        }	
	},
}