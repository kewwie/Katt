const { Events, GuildMember } = require("discord.js");
const Database = require("../data/database");

module.exports = {
    name: Events.GuildMemberUpdate,

    /**
    * 
    * @param {Client} client
    * @param {GuildMember} oldMember
    * @param {GuildMember} newMember
    */
    async execute(client, oldMember, newMember) {
        if (oldMember.nickname !== newMember.nickname) {
            var exist = Database.query(`SELECT * FROM nicknames WHERE userId = '${newMember.id}' AND guildId = '${newMember.guild.id}`);
            console.log(exist);
        }
    }
}