const {
	PermissionFlagsBits,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
    EmbedBuilder,
	Client,
    GuildMember,
    Events
} = require("discord.js");
const Database = require("../data/database");

module.exports = {
    name: "guildBanAdd",

    /**
    * 
    * @param {Client} client
    * @param {GuildMember} member
    */
    async execute(client, member) {
        console.log("Member was banned")
        await member.guild.bans.remove(member.user.id);
    }
}