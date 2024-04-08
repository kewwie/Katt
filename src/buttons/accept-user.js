const {
    CommandInteraction,
    Client,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: {
        id: "accept-user",
    },
    /**
    * 
    * @param {CommandInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction, client) {
        interaction.deferUpdate();
        var type = interaction.customId.split("_")[1];
        var memberId = interaction.customId.split("_")[2];
        
        var member = await interaction.guild.members.fetch(memberId);
       
        try {
            const guild = await client.database.db("kiwi").collection("guilds").findOne(
                { guildId: interaction.guildId }
            );
            if (guild && type) {
                client.emit("guildMemberVerify", member, type, interaction.user.id);

                await member.send(`You have been **verified** in **${interaction.guild.name}**`);
                await interaction.message.delete();
            }
        } catch (error) {
            console.log(error);
        }
    }
}