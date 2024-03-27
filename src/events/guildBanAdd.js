const {
	Client,
    GuildBan
} = require("discord.js");

module.exports = {
    name: "guildBanAdd",

    /**
    * 
    * @param {Client} client
    * @param {GuildBan} guildBan
    */
    async execute(client, guildBan) {
        await guildBan.guild.members.unban(guildBan.user);
    }
}