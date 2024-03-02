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
	.setName('create-list')
	.setDescription('Make a list that u can move a user down')
	.addStringOption(option =>
		option
			.setName('users')
			.setDescription('Example: Kewi,Soja,Timjan')
			.setRequired(true)
	)		
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	/**
    * 
    * @param {Interaction} interaction
    * @param {Client} client
    */
	async execute(interaction, client) {
		var usersString = interaction.options.getString('users');
		var users = usersString.split(",");

		var buttons = [];
		var userText = "";

	    for (let user of users) {
			var button = new ButtonBuilder()
				.setCustomId('update-list_' + user)
				.setLabel(user)
				.setStyle(ButtonStyle.Primary);

			buttons.push(button);
			userText += `${user}\n`
		}

		var rows = [];


		for (var i = 0; i < buttons.length; i += 3) {
			rows.push(
				new ActionRowBuilder()
					.addComponents(
						buttons.slice(i, (i + 3))
					)
			);
		}

		await interaction.reply({
			content: "List has been created",
			ephemeral: true
		});

		await interaction.channel.send({
			content: userText,
			components: rows,
		})
	},
}