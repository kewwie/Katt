import { KiwiClient } from "../client";

import {
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from "discord.js";
import { SlashCommand } from "../types/command";

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
				var usersString = interaction.options.getString('users');
				var users = usersString.split(",");

				var buttons = [];
				var userText = "";

				/*for (let user of users) {
					if (!user) break;
					let button = new ButtonBuilder(UpdateList.config)
						.setCustomId('update-list_' + user)
						.setLabel(user);

					buttons.push(button);
					userText += `${user}\n`
				}

				var rows = [];

				for (var i = 0; i < buttons.length; i += 3) {
					rows.push(
						new ActionRowBuilder()
                    		.addComponents(buttons.slice(i, (i + 3))).toJSON()
					);
				}

				await interaction.channel.send({
					content: userText,
					components: rows,
				});

				await interaction.reply({
					content: "List has been created",
					ephemeral: true
				});*/
				
				break;
			}
		}
    },
}