const {
    CommandInteraction,
    Client
} = require("discord.js");
const { env } = require("../env");

module.exports = {
    data: {
        id: "update-list",
    },
    /**
    * 
    * @param {CommandInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction, client) {
        var userToMove = interaction.customId.split("_")[1];
        var users = interaction.message.content.split("\n");

        let index = users.indexOf(userToMove);
    
        if (index !== -1) {
            users.splice(index, 1);
            users.push(userToMove);
        }
        
        var content = users.join("\n");
        
        interaction.update({ content });

        const guild = await client.database.db("kiwi").collection("guilds").findOne(
            { guildId: interaction.guildId }
        );

        if (guild && guild.logsChannel) {
            try {
                var log = await interaction.guild.channels.cache.get(guild.logsChannel);
                await log.send(`<@${interaction.user.id}> has moved down **${userToMove}** in [${interaction.channel.name}](${interaction.message.url})`);
            } catch (e) {
                console.error("Can not fetch logs channel.");
            }
        }
    }
}