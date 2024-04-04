const {
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
    EmbedBuilder,
	Client,
    GuildMember
} = require("discord.js");
const { env } = require("../env");

module.exports = {
    name: "guildMemberAdd",

    /**
    * 
    * @param {Client} client
    * @param {GuildMember} member
    */
    async execute(client, member) {
	    if (env.PENDING_CHANNEL) {
            var pendingChannel = await member.guild.channels.fetch(env.PENDING_CHANNEL);

            var verificationPing = `@everyone`;

            var em = new EmbedBuilder()
                .setTitle(member.user.username + "#" + member.user.discriminator)
                .setThumbnail(member.user.avatarURL())
                .setFields(
                    { name: "Mention", value: `<@${member.user.id}>`},
                    { name: "Created", value: member.user.createdAt.toDateString() }
                )
                .setColor(0xADD8E6);

            var acceptGuestButton = new ButtonBuilder()
				.setCustomId('accept-user_guest_' + member.user.id)
				.setLabel("Accept as Guest")
				.setStyle(ButtonStyle.Success);
            var acceptMemberButton = new ButtonBuilder()
				.setCustomId('accept-user_member_' + member.user.id)
				.setLabel("Accept as Member")
				.setStyle(ButtonStyle.Primary);

            var ignoreButton = new ButtonBuilder()
				.setCustomId('ignore-user_' + member.user.id)
				.setLabel("Ignore User")
				.setStyle(ButtonStyle.Danger);

            var row = new ActionRowBuilder()
                .addComponents([acceptGuestButton, acceptMemberButton])
            
            var row2 = new ActionRowBuilder()
                .addComponents([ignoreButton])

            await pendingChannel.send({
                content: verificationPing,
                embeds: [em],
                components: [row, row2]
            });
        }
    }
}
