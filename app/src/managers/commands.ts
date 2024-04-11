import { join } from"path";
import { readdirSync } from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { env } from "../env";
import { KiwiClient } from "../client";
import { Command } from "../types/command";

interface GuildCmdResponse {

}

export class CommandHandler {
    private client: KiwiClient;
    
    constructor(client: KiwiClient) {
        this.client = client;
    }

    load() {
        for (let file of readdirSync(join(__dirname, "..", "commands"))) {
            const command = require(join(__dirname, "..", "commands/", file));
            this.client.commands.set(command.config.name, command);
        }
    }

    async register(commands: Command[], guildId?: string | null) {

        var cmds = new Array();

        for (let command of commands) {
            cmds.push(command.config);
        }

        const rest = new REST({ version: '10' }).setToken(env.CLIENT_TOKEN);

        if (guildId) {
            let data: any = await rest.put(
                Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
                { body: cmds }
            )
            console.log(data)
            console.log(`Successfully reloaded ${data.length} guild (/) commands.`);
        } else {
            let data: any = await rest.put(
                Routes.applicationCommands(env.CLIENT_ID),
                { body: cmds }
            )
            console.log(`Successfully reloaded ${data.length} (/) commands.`);
        }
    }

    async unregister(guildId?: string | null) {
        const rest = new REST({ version: '10' }).setToken(env.CLIENT_TOKEN);

        if (guildId) {
            await rest.put(
                Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
                { body: [] }
            )
        } else {
            await rest.put(
                Routes.applicationCommands(env.CLIENT_ID),
                { body: [] }
            )
        }
    }
}