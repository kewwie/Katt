const {
    CommandInteraction,
    Client,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: {
        id: "ignore-user",
    },
    /**
    * 
    * @param {CommandInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction, client) {
        interaction.deferUpdate();
        var memberId = interaction.customId.split("_")[1];
        var member = await interaction.guild.members.fetch(memberId);

        try {
            const guild = await client.database.db("kiwi").collection("guilds").findOne(
                { guildId: interaction.guildId }
            );

            if (!guild) return interaction.followUp("This guild is not in the database.");
            await member.send(`You have been **denied** from **${interaction.guild.name}**`)
            await member.kick("Denied");
            await interaction.message.delete();

            if (guild.logsChannel) {

                var log = await interaction.guild.channels.cache.get(guild.logsChannel);
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
        } catch (e) {
            console.log(e);
        }

    }
}