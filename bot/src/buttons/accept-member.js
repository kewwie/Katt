const { Interaction, Client } = require("discord.js");
const Database = require("../data/database");

module.exports = {
    data: {
        id: "accept-member",
    },
    /**
    * 
    * @param {Interaction} interaction
    * @param {Client} client
    */
    async execute(interaction, client) {
        var memberId = interaction.customId.split("_")[1];
        
        var member = await interaction.guild.members.fetch(memberId);

        // Add role

        


        var channelId = await Database.query(`SELECT logsChannel FROM servers WHERE guildId = '${interaction.guildId}'`);
        if (channelId[0].length > 0) {

            var log = await interaction.guild.channels.cache.get(channelId[0][0].logsChannel);
            await log.send(`<@${interaction.user.id}> has moved down **${userToMove}**`);
        }
    }
}