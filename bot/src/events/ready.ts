import { KiwiClient } from "../client";
import { join } from "path";
import { readdirSync } from "fs";
import { REST, Routes } from "discord.js";
import { env } from "../env";

const event = {
    name: "ready",
    once: true,
    async execute(client: KiwiClient) {
        console.log(`${client.user?.username} is Online`);

        const commands: any = [];

        const commandsPath = join(__dirname, "..", 'commands');
        const commandFiles = readdirSync(commandsPath);
        for (const file of commandFiles) {
            const filePath = join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command.default && 'execute' in command.default) {
                client.commands.set(command.default.data.name, command);
                commands.push(command.default.data.toJSON());
            }
        }

        console.log(101100101);

        //const rest = new REST().setToken(env.CLIENT_TOKEN);
        console.log(2);

        (async () => {
            try {
                console.log(`Started refreshing ${client.commands.size} application (/) commands.`);

                /*const data: any = await rest.put(
                    Routes.applicationGuildCommands(env.CLIENT_ID, "1097941244027609139"),
                    { body: commands },
                );*/

                //console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                console.error(error);
            }
        })();
    }
}

export default event;