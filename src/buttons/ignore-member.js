const { Interaction, Client, EmbedBuilder } = require("discord.js");
const { env } = require("../env");

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

        try {
            await member.send(`You have been **denied** from **${interaction.guild.name}**`)
        } catch (e) {
            console.log(e);
        }
        await member.kick("Denied");
        await interaction.message.delete();

        if (env.LOGS_CHANNEL) {

            var log = await interaction.guild.channels.cache.get(env.LOGS_CHANNEL);
            var em = new EmbedBuilder()
                .setTitle(member.user.username + "#" + member.user.discriminator)
                .setThumbnail(member.user.avatarURL())
                .addFields(
                    { name: "Mention", value: `<@${member.user.id}>` },
                    { name: "Denied By", value: `<@${interaction.member.id}>` },
                    { name: "Action", value: "Kicked" }
                )
                .setColor(0xFF474D)

            await log.send({
                embeds: [em]
            });
        }

    }
}