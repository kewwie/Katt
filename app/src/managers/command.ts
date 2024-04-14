import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { env } from "../env";
import { KiwiClient } from "../client";
import { Command } from "../types/command";

export class CommandManager {
    public client: KiwiClient;
    
    constructor(client: KiwiClient) {
        this.client = client;
    }

    load(commands: Command[]) {
        for (var command of commands) {
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
            var data: any = await rest.put(
                Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
                { body: cmds }
            )
            console.log(`Successfully reloaded ${data.length} guild (/) commands.`);
        } else {
            var data: any = await rest.put(
                Routes.applicationCommands(env.CLIENT_ID),
                { body: cmds }
            )
            console.log(`Successfully reloaded ${data.length} (/) commands.`);
        }
    }

    async unregisterAll(guildId?: string | null) {
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

    async unregisterAllGuild() {
        const rest = new REST({ version: '10' }).setToken(env.CLIENT_TOKEN);

        for (var guild of this.client.guilds.cache) { // Doesnt find any guilds
            if (guild) {
                /*await rest.put(
                    Routes.applicationGuildCommands(env.CLIENT_ID, guild),
                    { body: [] }
                )*/
            }
        }
    }

    async onInteraction(interaction: any) {
        if (interaction.isChatInputCommand()) {
            const command = this.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}