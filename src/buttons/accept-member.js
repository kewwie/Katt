const { Interaction, Client, EmbedBuilder } = require("discord.js");
const { env } = require("../env");

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
        interaction.deferUpdate();
        var memberId = interaction.customId.split("_")[1];
        
        var member = await interaction.guild.members.fetch(memberId);

        if (env.VERIFIED_ROLE) {
            await member.roles.add(env.VERIFIED_ROLE);
            await member.send(`You have been **verified** in **${interaction.guild.name}**`)
            await interaction.message.delete();
    
            if (env.LOGS_CHANNEL) {

                var log = await interaction.guild.channels.cache.get(env.LOGS_CHANNEL);

                var addedRoles = member.roles.cache
                    .filter((roles) => roles.id !== interaction.guildId)
                    .sort((a, b) => b.rawPosition - a.rawPosition)
                    .map((role) => role.name);

                var em = new EmbedBuilder()
                    .setTitle(member.user.username + "#" + member.user.discriminator)
                    .setThumbnail(member.user.avatarURL())
                    .addFields(
                        { name: "Mention", value: `<@${member.user.id}>` },
                        { name: "Verified By", value: `<@${interaction.member.id}>` },
                        { name: "Roles", value: addedRoles.join(", ")}
                    )
                    .setColor(0x90EE90)

                await log.send({
                    embeds: [em]
                });
            }
        }
    }
}