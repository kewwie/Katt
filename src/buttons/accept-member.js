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
        var type = interaction.customId.split("_")[1];
        var memberId = interaction.customId.split("_")[2];
        
        var member = await interaction.guild.members.fetch(memberId);
        var roleId;

        switch (type) {
            case "guest":
                roleId = env.GUEST_ROLE;
                break;
            case "member":
                roleId = env.MEMEBER_ROLE;
                break;
        }

        if (roleId) {
            await member.roles.add(roleId);
            try {
                await member.send(`You have been **verified** in **${interaction.guild.name}**`);
            } catch (e) {
                console.log(e);
            }
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