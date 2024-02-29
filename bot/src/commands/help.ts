import { SlashCommandBuilder } from "discord.js";
import { KiwiClient } from "../client";

const command = {
    data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Application information'),
	async execute(interaction: any, client: KiwiClient) {
		await interaction.reply('Made by K3wwie');
	},
}

export default command;