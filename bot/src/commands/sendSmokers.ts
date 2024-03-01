import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
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
		await interaction.reply('Made by K3wwie');
	},
}

export default command;