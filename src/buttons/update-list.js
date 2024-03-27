const { Interaction, Client } = require("discord.js");
const { env } = require("../env");

module.exports = {
    data: {
        id: "update-list",
    },
    /**
    * 
    * @param {Interaction} interaction
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

        if (env.LOGS_CHANNEL) {

            var log = await interaction.guild.channels.cache.get(env.LOGS_CHANNEL);
            await log.send(`<@${interaction.user.id}> has moved down **${userToMove}** in [${interaction.channel.name}](${interaction.message.url})`);
        }
    }
}