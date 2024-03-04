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
		.setName('verification-settings')
		.setDescription('yeet')
		.addStringOption(option => 
            option
                .setName('option')
                .addChoices(
                    { name: 'Verification Logs', value: 'verification_logs' },
                    { name: 'Verification Role', value: 'verification_role' },
                    { name: 'Verification Admin', value: 'verification_admin' },
                    { name: "Verification Pending Channel", value: "verification_pending_channel" }
                )
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('value')
                .setRequired(true),
        ),

	/**
    * 
    * @param {Interaction} interaction
    * @param {Client} client
    */
	async execute(interaction, client) {

        var option = interaction.options.getString("option");
        var value = interaction.options.getString("value");
        var type = "";

        if (option === "verification_logs") {
            type = "logsChannel";
        } else if (option === "verification_role") {
            type = "verifiedRole";
        } else if (option === "verification_admin") {
            type = "adminRole";
        } else if  (option === "verification_pending_channel") {
            type = "pendingChannel";
        }

        var exist = await Database.query(`SELECT * FROM verification WHERE guildId = '${interaction.guildId}'`);
        if (exist[0].length > 0) {
            await Database.query(`UPDATE verification SET ${type} = '${value}' WHERE guildId = '${interaction.guildId}'`);
        } else {
            await Database.query(`INSERT INTO verification (guildId, ${type}) VALUES ('${interaction.guildId}', '${value}')`);
        }
	

		await interaction.reply({
			content: `Rank Valorant Check`,
			ephemeral: true
		});
	},
}