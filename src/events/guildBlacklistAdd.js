const {
	Client,
    GuildMember,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "guildBlacklistAdd",

    /**
    * 
    * @param {Client} client
    * @param {GuildMember} member
    */
    async execute(client, member) {
        try {
            await member.kick();

            const guild = await client.database.db("kiwi").collection("guilds").findOne(
                { guildId: member.guild.id }
            );
            if (guild && guild.logsChannel) {
                var log = await interaction.guild.channels.cache.get(guild.logsChannel);
                var em = new EmbedBuilder()
                    .setTitle(member.user.username + "#" + member.user.discriminator)
                    .setThumbnail(member.user.avatarURL())
                    .setDescription("User has been blacklisted")
                    .addFields(
                        { name: "Mention", value: `<@${member.user.id}>` },
                        { name: "Blacklisted By", value: `<@${blacklist.createdBy}>` },
                        { name: "Action", value: "Kicked" }
                    )
                    .setColor(0xFF474D)

                await log.send({
                    embeds: [em]
                });
            }
        }
        catch (e) {
            console.error("Failed to kick user from the guild.");
        }
    }
}