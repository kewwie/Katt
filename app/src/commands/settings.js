const {
	CommandInteraction,
	Client
} = require("discord.js");

const { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
	Permissions
} = require("../utils/commandTypes");

module.exports = {
	config: {
        name: "settings",
        description: "Settings Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.Administrator,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "logs_channel",
                description: "Set the logs channel for the server",
                options: [
                    {
                        type: OptionTypes.CHANNEL,
                        name: "channel",
                        description: "The channel to log in",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "pending_channel",
                description: "Set the pending channel for the server",
                options: [
                    {
                        type: OptionTypes.CHANNEL,
                        name: "channel",
                        description: "The channel to send join request in",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "guest_role",
                description: "Set the guest role for the server",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to assign to guests",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "member_role",
                description: "Set the member role for the server",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to assign to members",
                        required: true
                    }
                ]
            },
        ]
    },

	/**
    * 
    * @param {CommandInteraction} interaction
    * @param {Client} client
    */
	async execute(interaction, client) {
        switch (interaction.options.getSubcommand()) {
            case "logs_channel":
                client.database.db("kiwi").collection("guilds").updateOne(
                    { guildId: interaction.guildId },
                    { $set: { logsChannel: interaction.options.getChannel("channel").id } },
                    { upsert: true }
                );
                await interaction.reply({
                    content: "Logs channel has been set!",
                    ephemeral: true
                });
                break;
            case "pending_channel":
                client.database.db("kiwi").collection("guilds").updateOne(
                    { guildId: interaction.guildId },
                    { $set: { pendingChannel: interaction.options.getChannel("channel").id } },
                    { upsert: true }
                );
                await interaction.reply({
                    content: "Pending channel has been set!",
                    ephemeral: true
                });
                break;
            case "guest_role":
                client.database.db("kiwi").collection("guilds").updateOne(
                    { guildId: interaction.guildId },
                    { $set: { guestRole: interaction.options.getRole("role").id } },
                    { upsert: true }
                );           
                await interaction.reply({
                    content: "Guest role has been set!",
                    ephemeral: true
                });    
                break;
            case "member_role":
                client.database.db("kiwi").collection("guilds").updateOne(
                    { guildId: interaction.guildId },
                    { $set: { memberRole: interaction.options.getRole("role").id } },
                    { upsert: true }
                );       
                await interaction.reply({
                    content: "Member role has been set!",
                    ephemeral: true
                });         
                break;
        }
	},
}