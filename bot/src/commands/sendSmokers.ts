import { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { KiwiClient } from "../client";

const command = {
	data: new SlashCommandBuilder()
	.setName('sendSmockers')
	.setDescription('adding soon ig')
	/*.addStringOption(option =>
		option
			.setName('users')
			.setDescription('The reason for banning'))
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)*/,

	async execute(interaction: any, client: KiwiClient) {

	// add an option where you make a list with all names you want and add a "," inbetween them to make it work
		const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Ban')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
			.addComponents(cancel, confirm);

		await interaction.reply({
			content: "Hej",
			components: [row],
		});
	},
}

export default command;