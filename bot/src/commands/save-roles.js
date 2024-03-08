const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	Interaction,
	Client,
    GuildMember
} = require("discord.js");
const Database = require("../data/database");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('save-roles')
		.setDescription('Saves the roles of a user to the database')
		.addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to save the roles for')
                .setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	/**
    * 
    * @param {Interaction} interaction
    * @param {Client} client
    */
	async execute(interaction, client) {
		var user = interaction.options.getUser("user");

        for (var role of user.roles.cache) {
            var exist = await Database.query(`SELECT roleId FROM userRoles WHERE userId = '${user.id}' AND guildId = '${user.guild.id}' AND roleId = '${role.id}'`);
            if (!exist[0].length > 0) {
                await Database.query(`INSERT INTO userRoles (userId, guildId, roleId) VALUES ('${user.id}', '${user.guild.id}', '${role.id}')`);
            }
        }

		await interaction.reply({
			content: `Saved **${user.username}**'s roles`,
			ephemeral: true
		});
	},
}