const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Application information'),

	/**
    * 
    * @param {Interaction} interaction
    * @param {Client} client
    */
	async execute(interaction, client) {
		await interaction.reply('Made by K3wwie');
	},
}