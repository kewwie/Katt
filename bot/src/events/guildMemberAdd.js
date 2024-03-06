const {
	PermissionFlagsBits,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	Client,
    GuildMember
} = require("discord.js");
const Database = require("../data/database");

module.exports = {
    name: "guildMemberAdd",

    /**
    * 
    * @param {Client} client
    * @param {GuildMember} member
    */
    async execute(client, member) {
        var nickname = await Database.query(`SELECT nickname FROM nicknames WHERE userId = '${member.id}' AND guildId = '${member.guild.id}'`);
        if (nickname[0].length > 0) {
            await member.setNickname(nickname[0][0].nickname);
        }

        var servers = await Database.query(`SELECT pendingChannel FROM servers WHERE guildId = '${member.guild.id}'`);
		if ((servers[0][0].pendingChannel).length > 0) { // If pending channel exist
            var pendingChannel = await member.guild.channels.fetch(servers[0][0].pendingChannel);

            var acceptButton = new ButtonBuilder()
				.setCustomId('accept_' + member.user.id)
				.setLabel("Accept")
				.setStyle(ButtonStyle.Success);

            var ignoreButton = new ButtonBuilder()
				.setCustomId('ignore_' + member.user.id)
				.setLabel("Ignore")
				.setStyle(ButtonStyle.Danger);

            await pendingChannel.send(member.user.username);
        }
    }
}