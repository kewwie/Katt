const { join } = require("path");
const { readdirSync } = require("fs");
const { REST, Routes } = require("discord.js");
const { env } = require("../env");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`${client.user?.username} is Online`);

        const cmds = [];

        const commandsPath = join(__dirname, "..", 'commands');
        const commandFiles = readdirSync(commandsPath);
        for (const file of commandFiles) {
            const filePath = join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                cmds.push(command.data.toJSON());
            }
        }

        const rest = new REST().setToken(env.CLIENT_TOKEN);
        
        (async () => {
            try {
                console.log(`Started refreshing ${cmds.length} application (/) commands.`);

                const data = await rest.put(
                    Routes.applicationGuildCommands(env.CLIENT_ID, "1097941244027609139"),
                    { body: cmds },
                );

                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                console.error(error);
            }
        })();
    }
}