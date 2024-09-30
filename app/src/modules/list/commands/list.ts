import { KiwiClient } from "../../../client";

import {
	ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import { SlashCommand } from "../../../types/command";

import { UpdateListButton } from "../buttons/updateList";

/**
 * @type {SlashCommand}
 */
export const ListSlash: SlashCommand = {
    config: new SlashCommandBuilder()
        .setName("list")
        .setDescription("Manage lists")
        .addSubcommand(subcommand => 
            subcommand
                .setName("create")
                .setDescription("Create a list")
                .addStringOption(option => option
                    .setName("users")
                    .setDescription("Users to add to the list")
                    .setRequired(true)
                )
        ),
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {KiwiClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        switch (interaction.options.getSubcommand()) {
            case "create": {
				var rows = [];
				var buttons = [];
				var userText = "";
				var users = interaction.options.getString('users').split(",");


				for (let user of users) {
					if (!user) break;
					var customId = await client.createCustomId({ start: UpdateListButton.customId, optionOne: user });	
					let button = new ButtonBuilder()
						.setStyle(ButtonStyle.Primary)
						.setCustomId(customId)
						.setLabel(user);

					buttons.push(button);
					userText += `${user}\n`
				}

				for (var i = 0; i < buttons.length; i += 3) {
					rows.push(
						new ActionRowBuilder()
                    		.addComponents(buttons.slice(i, (i + 3)))
					);
				}

				interaction.reply({
					content: userText,
					components: rows,
					ephemeral: false
				});
				
				break;
			}
		}
    },
}