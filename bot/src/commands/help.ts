import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Application information'),
	async execute(client: any, interaction: any) {
		await interaction.reply('Made by K3wwie');
	},
}