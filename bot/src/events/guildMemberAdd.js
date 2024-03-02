const { Events, GuildMember } = require("discord.js");
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
                console.log(nickname[0][0].nickname)
                await member.setNickname(nickname[0][0].nickname);
            }
    }
}