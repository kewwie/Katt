const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	Interaction,
	Client
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
	.setName('save-nicknames')
	.setDescription('Saves all nicknames for all users to the database')	
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	/**
    * 
    * @param {Interaction} interaction
    * @param {Client} client
    */
	async execute(interaction, client) {
		for (var user of interaction.guild.members.cache.values()) {
			console.log(user);
		}

		await interaction.reply({
			content: "Saved everyone's nickname",
			ephemeral: true
		});
	},
}