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
				.setCustomId('accept-member_guest_' + member.user.id)
				.setLabel("Accept")
				.setStyle(ButtonStyle.Success);
            var acceptMemberButton = new ButtonBuilder()
				.setCustomId('accept-member_member_' + member.user.id)
				.setLabel("Accept")
				.setStyle(ButtonStyle.Success);

            var ignoreButton = new ButtonBuilder()
				.setCustomId('ignore-member_' + member.user.id)
				.setLabel("Ignore")
				.setStyle(ButtonStyle.Danger);

            var row = new ActionRowBuilder()
                .addComponents([acceptGuestButton, acceptMemberButton, ignoreButton])

            await pendingChannel.send({
                content: verificationPing,
                embeds: [em],
                components: [row]
            });
        }
    }
}
