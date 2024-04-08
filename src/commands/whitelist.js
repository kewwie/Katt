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
        name: "whitelist",
        description: "Whitelist Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageGuild,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "add",
                description: "Add a user to the whitelist",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user to whitelist",
                        required: true
                    },
                    {
                        type: OptionTypes.STRING,
                        name: "level",
                        description: "The level of the whitelist",
                        required: true,
                        choices: [
                            { name: "Guest", value: "guest" },
                            { name: "Member", value: "member" }
                        ]
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "remove",
                description: "Remove a user from the whitelist",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user to remove from the whitelist",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "view",
                description: "View the whitelist",
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
                var user = interaction.options.getUser("user");
                if (!user) return interaction.reply("User not found");
                var whitelist = await client.database.db("kiwi").collection("whitelist").findOne(
                    { userId: user.id }
                );
                if (whitelist) return interaction.reply("User is already whitelisted");
                await client.database.db("kiwi").collection("whitelist").insertOne(
                    { 
                        userId: user.id,
                        username: user.username,
                        discriminator: user.discriminator,
                        createdAt: Date.now(),
                        createdBy: interaction.user.id,
                        level: interaction.options.getString("level") || "guest"
                    }
                );
                interaction.reply(`**${user.username}#${user.discriminator}** has been whitelisted`);
                break;
            }
            case "remove": {
                var user = interaction.options.getUser("user");
                if (!user) return interaction.reply("User not found");
                var whitelist = await client.database.db("kiwi").collection("whitelist").findOne(
                    { userId: user.id }
                );
                if (!whitelist) return interaction.reply("User is not whitelisted");
                await client.database.db("kiwi").collection("whitelist").deleteOne(
                    { userId: user.id }
                );
                interaction.reply(`**${user.username}#${user.discriminator}** has been removed from the whitelist`);
                break;
            }
            case "view": {
                var whitelist = await client.database.db("kiwi").collection("whitelist").find().toArray();
                if (!whitelist) return interaction.reply("No users are whitelisted");
                var users = whitelist.map(user => user.userId);
                interaction.reply(`Whitelisted Users: ${users.map(userId => `<@${userId}>`).join(", ")}`);
                break;
            }
        }
    }
        
}