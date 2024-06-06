import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { env } from "../env";
import { KiwiClient } from "../client";
import { SlashCommand } from "../types/command";

import { dataSource } from "../datasource";
import { GuildPluginEntity } from "../entities/GuildPlugin";

export class CommandManager {
    public client: KiwiClient;
    
    constructor(client: KiwiClient) {
        this.client = client;
    }

    load(commands: SlashCommand[]) {
        for (var command of commands) {
            this.client.SlashCommands.set(command.config.name, command);
        }
    }

    async register(commands: SlashCommand[], guildId: string) {
        var cmds = new Array();

        for (let command of commands) {
            cmds.push(command.config);
        }

        const rest = new REST({ version: '10' }).setToken(env.CLIENT_TOKEN);

        var data: any = await rest.put(
            Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
            { body: cmds }
        )
        console.log(`Successfully reloaded ${data.length} (/) commands in ${guildId}`);
    }

    async unregister(guildId: string) {
        const rest = new REST({ version: '10' }).setToken(env.CLIENT_TOKEN);

        await rest.put(
            Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
            { body: [] }
        )

        console.log(`Successfully removed all (/) commands in ${guildId}`);
    }

    async onInteraction(interaction: any) {
        const GuildPluginsRepository = await dataSource.getRepository(GuildPluginEntity);

        if (interaction.isChatInputCommand()) {

            const command = this.client.SlashCommands.get(interaction.commandName);

            if (!command) return;

            try {
                if (command.plugin) {
                    var plugin = this.client.PluginManager.plugins.find(plugin => plugin.config.name === command.plugin);
                    if (!plugin.config.disableable) {
                        await command.execute(interaction, this.client);
                    } else {
                        if (interaction.guild) {
                            const status = await GuildPluginsRepository.findOne({ where: { guildId: interaction.guild.id, pluginName: command.plugin } });
                            if (status) {
                                await command.execute(interaction, this.client);
                            } else {
                                await interaction.reply({ content: 'This plugin is disabled!', ephemeral: true });
                            }
                        }
                    }
                }
               
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }

        } else if (interaction.isAutocomplete()) {

            const command = this.client.SlashCommands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.autocomplete(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
            
        }
    }
}