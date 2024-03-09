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

        var servers = await Database.query(`SELECT verificationAdmin, logsChannel, verifiedRole FROM servers WHERE guildId = '${interaction.guildId}'`, { plain: true, logging: false });

        if (servers.verificationAdmin && interaction.member.roles.cache.has(servers.verificationAdmin)) {

            await member.send(`You have been **denied** from **${interaction.guild.name}**`)
            await member.kick("Denied");
            await interaction.message.delete();

            if (servers.logsChannel) {

                var log = await interaction.guild.channels.cache.get(servers.logsChannel);
                var em = new EmbedBuilder()
                    .setTitle(member.user.username + "#" + member.user.discriminator)
                    .setThumbnail(member.user.avatarURL())
                    .addFields(
                        { name: "Mention", value: `<@${member.user.id}>` },
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