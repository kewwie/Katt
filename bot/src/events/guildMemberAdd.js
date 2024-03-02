const { Events, GuildMember } = require("discord.js");
const Database = require("../data/database");

module.exports = {
    name: "guildMemberUpdate",

    /**
    * 
    * @param {Client} client
    * @param {GuildMember} member
    */
    async execute(client, member) {
            var nickname = await Database.query(`SELECT nickname FROM nicknames WHERE userId = '${newMember.id}' AND guildId = '${newMember.guild.id}'`);
            console.log(nickname);
            if (nickname[0].length > 0) {
                member.edit({ nickname: nickname });
            }
    }
}