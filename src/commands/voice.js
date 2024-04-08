const {
	CommandInteraction,
	Client
} = require("discord.js");

const { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes
} = require("../utils/commandTypes");

module.exports = {
	config: {
        name: "voice",
        description: "Voice Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: null,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "activity",
                description: "View a users voice chat activity",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user you want to check the activity of",
                        required: false
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
        switch (interaction.options.getSubcommand()) {
            case "activity": {
                var member = interaction.options.getUser("user") || interaction.member;
                if (!member) return interaction.reply("User not found");
                var voiceActivity = await client.database.db("kiwi").collection("voiceActivity").findOne(
                    { userId: member.id, guildId: interaction.guildId }
                );
                if (!voiceActivity || voiceActivity.minutes < 0) return interaction.reply("No voice activity found for this user");
                interaction.reply(`**${member.username}#${member.discriminator}** has been in voice chat for **${Math.floor(voiceActivity.minutes)}** minutes`);
                break;
            }
        }
    }
}