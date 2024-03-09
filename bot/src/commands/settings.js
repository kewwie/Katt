const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	Interaction,
	Client
} = require("discord.js");
const Database = require("../data/database");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Change the settings for your server')
		.addStringOption(option => 
            option
                .setName('option')
                .setDescription('Select the option you want to change')
                .addChoices(
                    { name: 'Logs', value: 'logsChannel' },
                    { name: 'Verified Role', value: 'verifiedRole' },
                    { name: 'Verification Admin', value: 'verificationAdmin' },
                    { name: "Pending Verification Channel", value: "pendingChannel" }
                )
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('value')
                .setDescription('What value should the option be')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	/**
    * 
    * @param {Interaction} interaction
    * @param {Client} client
    */
	async execute(interaction, client) {

        var option = interaction.options.getString("option");
        var value = interaction.options.getString("value");

        value = value.substring(2, value.length - 1);
        if (value.includes("&")) {
            value = value.substring(1, value.length);
        }

        var exist = await Database.query(`SELECT * FROM servers WHERE guildId = '${interaction.guildId}'`, { plain: false, logging: false });
        if (exist) {
            await Database.query(`UPDATE servers SET ${option} = '${value}' WHERE guildId = '${interaction.guildId}'`, { logging: false });
        } else {
            await Database.query(`INSERT INTO servers (guildId, ${option}) VALUES ('${interaction.guildId}', '${value}')`, { logging: false });
        }
	

		await interaction.reply({
			content: `Updated Settings for ${interaction.guild.name}`,
			ephemeral: true
		});
	},
}