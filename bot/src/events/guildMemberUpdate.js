const { Events, GuildMember } = require("discord.js");
const Database = require("../data/database");

module.exports = {
    name: "guildMemberUpdate",

    /**
    * 
    * @param {Client} client
    * @param {GuildMember} oldMember
    * @param {GuildMember} newMember
    */
    async execute(client, oldMember, newMember) {
        console.log("newMemer")
        if (oldMember.nickname !== newMember.nickname) {
            var exist = await Database.query(`SELECT * FROM nicknames WHERE userId = '${newMember.id}' AND guildId = '${newMember.guild.id}'`);
            if (exist[0].length > 0) {
                console.log("update");
            } else {
                await Database.query(`INSERT INTO nicknames (userId, guildId, nickname) VALUES ('${newMember.id}', '${newMember.guild.id}', '${newMember.nickname}')`);
            }
        }
    }
}