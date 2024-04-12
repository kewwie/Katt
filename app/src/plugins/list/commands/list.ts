import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
} from "discord.js";

import { KiwiClient } from "../../../client";
import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
	Permissions,
	Command
} from "../../../types/command";

import { ButtonBuilder } from "../../../builders/button";
import { ButtonStyles } from "../../../types/component";

import { UpdateList } from "../buttons/update-list";

import { RowBuilder } from "../../../builders/row";

export const List: Command = {
	config: {
        name: "list",
        description: "List Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageChannels,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "create",
                description: "Create a list",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "users",
                        description: "Example: Kewi,Soja,Timjan",
                        required: true
                    }
                ]
            }
        ]
    },

	/**
    * 
    * @param {ChatInputCommandInteraction} interaction
    * @param {Client} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient) {		
		var usersString = interaction.options.getString('users');
		var users = usersString.split(",");

		var buttons = [];
		var userText = "";

	    for (let user of users) {
			if (!user) break;
			var button = new ButtonBuilder()
				.setButton(UpdateList.config)
				.setCustomId('update-list_' + user)
				.setLabel(user)
				.setStyle(ButtonStyles.Primary);

			buttons.push(button);
			userText += `${user}\n`
		}

		var rows = [];


		for (var i = 0; i < buttons.length; i += 3) {
			rows.push(
				new RowBuilder().addComponents(buttons.slice(i, (i + 3)))
			);
		}

		console.log(rows);

		let data: any = await interaction.channel.send({
			content: userText,
			components: rows,
		})

		console.log(data.rawError.errors, 110101010)

		await interaction.reply({
			content: "List has been created",
			ephemeral: true
		});
	},
}