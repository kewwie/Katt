const {
	PermissionFlagsBits,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
    EmbedBuilder,
	Client,
    GuildBan
} = require("discord.js");
const Database = require("../data/database");

module.exports = {
    name: "guildBanAdd",

    /**
    * 
    * @param {Client} client
    * @param {GuildBan} guildBan
    */
    async execute(client, guildBan) {
        console.log("Member was banned")
        await guildBan.guild.bans.remove(guildBan.user.id);
    }
}