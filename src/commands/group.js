const {
	Client,
    CommandInteraction
} = require("discord.js");

const { env } = require("../env");

const { 
    CommandTypes,
    SlashCommandContexts,
    IntegrationTypes,
    OptionTypes,
    Permissions
} = require("../utils/commandTypes");

module.exports = {
	config: {
        name: "group",
        description: "Group Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageChannels,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "create",
                description: "Create a group",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "name",
                        description: "Name of the group",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "delete",
                description: "Delete a group",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "name",
                        description: "Name of the group",
                        required: true
                    }
                ]
            }
        ]
    },

	/**
    * 
    * @param {CommandInteraction} interaction
    * @param {Client} client
    */
	async execute(interaction, client) {
		await interaction.reply({
			content: "Test group command",
			ephemeral: true
		});
	},
}