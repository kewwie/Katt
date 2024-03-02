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
			var exist = await Database.query(`SELECT * FROM nicknames WHERE userId = '${user.id}' AND guildId = '${user.guild.id}'`);
            if (exist[0].length > 0) {
                await Database.query(`UPDATE nicknames SET nickname = '${user.nickname}' WHERE userId = '${user.id}' AND guildId = '${user.guild.id}'`);
            } else {
                await Database.query(`INSERT INTO nicknames (userId, guildId, nickname) VALUES ('${user.id}', '${user.guild.id}', '${user.nickname}')`);
            }
		}

		await interaction.reply({
			content: "Saved everyone's nickname",
			ephemeral: true
		});
	},
}