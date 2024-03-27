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
        console.log("Member was banned")
        await guildBan.guild.bans.remove(guildBan.user.id);
    }
}