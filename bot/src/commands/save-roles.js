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
		var member = interaction.options.getMember("user");

        member.roles.cache.forEach(async (role) => {
			if (role.name === "@everyone") return;
            var exist = await Database.query(`SELECT roleId FROM userRoles WHERE userId = '${member.user.id}' AND guildId = '${member.guild.id}' AND roleId = '${role.id}'`, { plain: false, logging: false });
            if (!exist) {
                Database.query(`INSERT INTO userRoles (userId, guildId, roleId) VALUES ('${member.user.id}', '${member.guild.id}', '${role.id}')`);
            }
        });

		await interaction.reply({
			content: `Saved **${member.user.username}**'s roles`,
			ephemeral: true
		});
	},
}