const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	Interaction,
	Client
} = require("discord.js");
const { env } = require("../env");
const axios = require("axios");
const Database = require("../data/database");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('valorant-rank')
		.setDescription('yeet')
		.addUserOption(option =>
            option
                .setName('user')
                .setDescription('hi')
                .setRequired(false)
        ),

	/**
    * 
    * @param {Interaction} interaction
    * @param {Client} client
    */
	async execute(interaction, client) {
        var res = await axios.get(`https://eu.api.riotgames.com/val/content/v1/contents`, {
         
            headers: {
                'Authorization': 'Bearer  ' + env.VALORANT_API_KEY
            }
        })

        console.log(res.data);
        console.log(env.VALORANT_API_KEY);

		await interaction.reply({
			content: `Rank Valorant Check`,
			ephemeral: true
		});
	},
}