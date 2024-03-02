const { Interaction, Client } = require("discord.js");
const { env } = require("../env");

module.exports = {
    data: {
        id: "update-smoker",
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

        var log = await interaction.guild.channels.cache.get(env.SMOKER_LOGS);
		await log.send(`<@${interaction.user.id}> has moved down **${userToMove}**`);
    }
}