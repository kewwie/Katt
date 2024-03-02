const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Application information'),
	async execute(interaction, client) {
		await interaction.reply('Made by K3wwie');
	},
}