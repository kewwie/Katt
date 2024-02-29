import { SlashCommandBuilder } from "discord.js";

export const config = {
    data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Application information'),
	async execute(interaction: any, client: any) {
		await interaction.reply('Made by K3wwie');
	},
}