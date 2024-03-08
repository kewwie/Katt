const { Interaction, Client, EmbedBuilder } = require("discord.js");
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

        var servers = await Database.query(`SELECT verificationAdmin, logsChannel, verifiedRole FROM servers WHERE guildId = '${interaction.guildId}'`);

        if (servers[0][0].verificationAdmin && interaction.member.roles.cache.has(servers[0][0].verificationAdmin)) {

            if (servers[0][0].verifiedRole) {
                await member.roles.add(servers[0][0].verifiedRole);
        
                if (servers[0][0].logsChannel) {

                    var log = await interaction.guild.channels.cache.get(servers[0][0].logsChannel);

                    var addedRoles = []
                    for (var role of member.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition)) {
                        addedRoles.push(role.name)
                    }

                    console.log(addedRoles)

                    var em = new EmbedBuilder()
                        .setAuthor({
                            name: member.user.username,
                            iconURL: member.user.iconURL,
                            url: `https://discord.com/users/${member.user.id}`
                        })
                        .addFields(
                            { name: "Verfied By", value: interaction.member.user.username },
                            { name: "Roles", value: addedRoles}
                        )

                    await log.send({
                        embeds: [em]
                    });
                }
            }
        }
    }
}