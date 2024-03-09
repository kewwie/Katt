const { Interaction, Client, EmbedBuilder } = require("discord.js");
const { QueryTypes } = require('sequelize');
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
        interaction.deferUpdate();
        var memberId = interaction.customId.split("_")[1];
        
        var member = await interaction.guild.members.fetch(memberId);

        var servers = await Database.query(`SELECT verificationAdmin, logsChannel, verifiedRole FROM servers WHERE guildId = '${interaction.guildId}'`, { plain: true, logging: false });

        if (servers.verificationAdmin && interaction.member.roles.cache.has(servers.verificationAdmin)) {

            if (servers.verifiedRole) {
                var userRoles = await Database.query(`SELECT roleId FROM userRoles WHERE guildId = '${member.guild.id}' AND userId = '${member.user.id}'`, { plain: false, logging: false, type: QueryTypes.SELECT });

                console.log(userRoles);
        
                if (userRoles) {
                    for (var role of userRoles) {
                        if (interaction.guild.roles.cache.find(x => x.id === role.roleId)) {
                            if (role.roleId === interaction.guildId) break;
                            if (role.roleId === servers.verifiedRole) break;
                            await member.roles.add(role.roleId)
                        }
                    }
                }

                await member.roles.add(servers.verifiedRole);
                await interaction.message.delete();
        
                if (servers.logsChannel) {

                    var log = await interaction.guild.channels.cache.get(servers.logsChannel);

                    var addedRoles = member.roles.cache
                        .filter((roles) => roles.id !== interaction.guildId)
                        .sort((a, b) => b.rawPosition - a.rawPosition)
                        .map((role) => role.name);

                    var em = new EmbedBuilder()
                        .setAuthor({
                            name: member.user.username,
                            iconURL: member.user.avatarURL(),
                            url: `https://discord.com/users/${member.user.id}`
                        })
                        .addFields(
                            { name: "Verified By", value: interaction.member.user.username },
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
}