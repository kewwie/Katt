const {
	PermissionFlagsBits,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
    EmbedBuilder,
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

        var servers = await Database.query(`SELECT pendingChannel, verificationAdmin FROM servers WHERE guildId = '${member.guild.id}'`);
		if ((servers[0][0].pendingChannel).length > 0) { // If pending channel exist
            var pendingChannel = await member.guild.channels.fetch(servers[0][0].pendingChannel);

            var adminPing;
            if ((servers[0][0].verificationAdmin).length > 0) {
                adminPing = `<@${servers[0][0].verificationAdmin}>`;
            }

            var em = new EmbedBuilder()
                .setTitle(member.user.username + "#" + member.user.discriminator)
                .setThumbnail(member.user.avatarURL())
                .setFields(
                    { name: "Mention", value: `<@${member.user.id}>`},
                    { name: "Created", value: member.user.createdAt.toUTCString() }
                )
                .setColor(0xADD8E6);

            var acceptButton = new ButtonBuilder()
				.setCustomId('accept-member_' + member.user.id)
				.setLabel("Accept")
				.setStyle(ButtonStyle.Success);

            var ignoreButton = new ButtonBuilder()
				.setCustomId('ignore-member_' + member.user.id)
				.setLabel("Ignore")
				.setStyle(ButtonStyle.Danger);

            var row = new ActionRowBuilder()
                .addComponents([acceptButton, ignoreButton])

            await pendingChannel.send({
                content: adminPing,
                embeds: [em],
                components: [row]
            });
        }
    }
}