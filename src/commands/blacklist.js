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
        name: "blacklist",
        description: "Blacklist Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageGuild,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "add",
                description: "Add a user to the blacklist",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user to blacklist",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "remove",
                description: "Remove a user from the blacklist",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user to remove from the blacklist",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "view",
                description: "View the blacklist",
            }
        ]
    },

	/**
    * @param {CommandInteraction} interaction
    * @param {Client} client
    */
	async execute(interaction, client) {
        switch (interaction.options.getSubcommand()) {
            case "add": {
                var member = interaction.options.getMember("user");
                if (!member) {
                    member = interaction.options.getUser("user");
                    if (!member) return interaction.reply("User not found");
                }

                var username, discriminator;
                if (member && member.roles) {
                    if (
                        member.roles.highest.rawPosition >=
                        interaction.member.roles.highest.rawPosition ||
                        interaction.user.id !== interaction.guild.ownerId
                    ) return interaction.reply("You cannot blacklist this user");
                    username = member.user.username;
                    discriminator = member.user.discriminator;
                } else {
                    if (member.id === interaction.user.id) return interaction.reply("You cannot blacklist yourself");
                    if (member.bot) return interaction.reply("You cannot blacklist a bot");
                    username = member.username;
                    discriminator = member.discriminator;
                }

                var blacklist = await client.database.db("kiwi").collection("blacklist").findOne(
                    { userId: member.id }
                );
                if (blacklist) return interaction.reply(username + " is already blacklisted");
                await client.database.db("kiwi").collection("blacklist").insertOne(
                    { 
                        userId: member.id,
                        username: username,
                        discriminator: discriminator,
                        createdAt: Date.now(),
                        createdBy: interaction.user.id
                    }
                );
                interaction.reply(`**${username}#${discriminator}** has been blacklisted`);
                client.emit("guildBlacklistAdd", member);
                break;
            }
            case "remove": {
                var user = interaction.options.getUser("user");
                if (!user) return interaction.reply("User not found");
                var blacklist = await client.database.db("kiwi").collection("blacklist").findOne(
                    { userId: user.id }
                );
                if (!blacklist) return interaction.reply("User is not blacklisted");
                await client.database.db("kiwi").collection("blacklist").deleteOne(
                    { userId: user.id }
                );
                interaction.reply(`**${user.username}#${user.discriminator}** has been removed from the blacklist`);
                break;
            }
            case "view": {
                var blacklist = await client.database.db("kiwi").collection("blacklist").find().toArray();
                if (!blacklist) return interaction.reply("No users are blacklisted");
                var users = blacklist.map(user => user.userId);
                interaction.reply(`Blacklisted Users: ${users.map(userId => `<@${userId}>`).join(", ")}`);
                break;
            }
        }
    }
		
}