const { Interaction, Client, EmbedBuilder } = require("discord.js");
const Database = require("../data/database");

module.exports = {
    data: {
        id: "ignore-member",
    },
    /**
    * 
    * @param {Interaction} interaction
    * @param {Client} client
    */
    async execute(interaction, client) {
        interaction.deferUpdate();
        var memberId = interaction.customId.split("_")[1];
        var member = await interaction.guild.members.fetch(memberId);

        var servers = await Database.query(`SELECT verificationAdmin, logsChannel, verifiedRole FROM servers WHERE guildId = '${interaction.guildId}'`);

        if (servers[0][0].verificationAdmin && interaction.member.roles.cache.has(servers[0][0].verificationAdmin)) {

            await member.send(`You have been **denied** from **${interaction.guild.name}**`)
            await member.kick("Denied");
            await interaction.message.delete();

            if (servers[0][0].logsChannel) {

                var log = await interaction.guild.channels.cache.get(servers[0][0].logsChannel);
                var em = new EmbedBuilder()
                    .setAuthor({
                        name: member.user.username,
                        iconURL: member.user.avatarURL(),
                        url: `https://discord.com/users/${member.user.id}`
                    })
                    .addFields(
                        { name: "Denied By", value: interaction.member.user.username },
                        { name: "Action", value: "Kicked" }
                    )
                    .setColor(0xFF474D)

                await log.send({
                    embeds: [em]
                });
            }
        }
    }
}