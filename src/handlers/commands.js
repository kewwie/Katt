const { join } = require("path");
const { readdirSync } = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { env } = require("../env");

module.exports = class EventHandler {
    constructor(client) {
        this.client = client;
    }

    load() {
        for (let file of readdirSync(join(__dirname, "..", "commands"))) {
            const command = require(join(__dirname, "..", "commands/", file));
            this.client.commands.set(command.config.name, command);
        }
    }

    async register(commands, guild = null) {

        var cmds = new Array();

        for (let command of commands) {
            cmds.push(JSON.stringify(command.config));
        }

        const rest = new REST({ version: '10' }).setToken(env.CLIENT_TOKEN);

        console.log(guild,1 )
        if (guild) {
            let data = await rest.put(
                Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID),
                { body: cmds }
            )
            console.log(data,1)
            console.log(`Successfully reloaded ${data.length} guild (/) commands.`);
        } else {
            let data = await rest.put(
                Routes.applicationCommands(env.CLIENT_ID),
                { body: cmds }
            )

            console.log(`Successfully reloaded ${data.length} (/) commands.`);
        }
    }
}