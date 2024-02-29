import { KiwiClient } from "../client";
import { join } from "path";
import { readdirSync } from "fs";
import { REST, Routes } from "discord.js";
import { env } from "../env";

export default {
    async execute(client: KiwiClient) {
        console.log(`${client.user?.username} is Online`);

        const commands: any[] = [];

        const foldersPath = join(__dirname, "..", 'commands');
        const commandFolders = readdirSync(foldersPath);

        for (const folder of commandFolders) {
            const commandsPath = join(foldersPath, folder);
            const commandFiles = readdirSync(commandsPath);
            for (const file of commandFiles) {
                const filePath = join(commandsPath, file);
                const command = require(filePath);
                if ('config' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    commands.push(command.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "config" or "execute" property.`);
                }
            }
        }

        const rest = new REST().setToken(env.CLIENT_TOKEN);

        (async () => {
            try {
                console.log(`Started refreshing ${client.commands.size} application (/) commands.`);

                const data: any = await rest.put(
                    Routes.applicationGuildCommands(env.CLIENT_ID, "1097941244027609139"),
                    { body: commands },
                );

                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                console.error(error);
            }
        })();
    }
}