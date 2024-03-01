import { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { KiwiClient } from "../client";

const command = {
    data: new SlashCommandBuilder()
		.setName('sendSmokers')
		.setDescription('Send the list for smokers')
		.addStringOption((option: any) =>
			option.setName('input')
				.setDescription('The input to echo back')
				.setDescription('The member to ban')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

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
			content: `Hej Hej`,
			components: [row],
		});
	},
}

export default command;