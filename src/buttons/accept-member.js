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
                            if (role.roleId === interaction.guildId) continue;
                            if (role.roleId === servers.verifiedRole) continue;
                            await member.roles.add(role.roleId)
                        }
                    }
                }

                await member.roles.add(servers.verifiedRole);
                await member.send(`You have been **verified** in **${interaction.guild.name}**`)
                await interaction.message.delete();

                Database.query(`INSERT INTO verified (userId, guildId, dateTime, byUser) VALUES ('${member.user.id}', '${member.guild.id}', '${new Date().toISOString()}', '${interaction.member.id}')`, { logging: false });
        
                if (servers.logsChannel) {

                    var log = await interaction.guild.channels.cache.get(servers.logsChannel);

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
}