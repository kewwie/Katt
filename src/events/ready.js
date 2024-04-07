const { Client, CommandInteraction } = require("discord.js");
const { env } = require("../env");

module.exports = {
    name: "ready",
    once: true,

    /**
    * 
    * @param {Client} client
    * @param {CommandInteraction} interaction
    */
    async execute(client) {
        console.log(`${client.user?.username} is Online`);

        if (env.STATUS === "dev") {
            client.commandHandler.register(client.commands.values(), env.GUILD_ID);
        } else {
            client.commandHandler.register(client.commands.values());
        }
        
    }
}