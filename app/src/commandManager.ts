import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { env } from "./env";
import { KiwiClient } from "./client";
import {
    PrefixCommand,
    SlashCommand,
    UserCommand,
    CommandOptions
} from "./types/command";
import { Collection, Message } from "discord.js";

export class CommandManager {
    public client: KiwiClient;
    public PrefixCommands: Collection<string, PrefixCommand>;
    public SlashCommands: Collection<string, SlashCommand>;
    public UserCommands: Collection<string, UserCommand>;
    
    constructor(client: KiwiClient) {
        this.client = client;

        this.PrefixCommands = new Collection();
        this.SlashCommands = new Collection();
        this.UserCommands = new Collection();
    }

    loadPrefix(command: PrefixCommand) {
        this.PrefixCommands.set(command.config.name, command);
    }

    loadSlash(command: SlashCommand) {
        this.SlashCommands.set(command.config.name, command);
    }

    loadUser(command: UserCommand) {
        this.UserCommands.set(command.config.name, command);
    }

    async register(commands: any[], guildId: string) {
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

    async unregister(guildId?: string) {
        const rest = new REST({ version: '10' }).setToken(env.CLIENT_TOKEN);

        if (!guildId) {
            await rest.put(
                Routes.applicationCommands(env.CLIENT_ID),
                { body: [] }
            )
            console.log(`Successfully removed all (/) commands globally`);
        }
        else {
            await rest.put(
                Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
                { body: [] }
            )
            console.log(`Successfully removed all (/) commands in ${guildId}`);
        }
    }

    async onInteraction(interaction: any) {

        if (interaction.isChatInputCommand()) {

            let command = this.SlashCommands.get(interaction.commandName);

            if (!command) return;

            if (interaction.guildId) {
                if (command.premissionLevel) {
                    let hasHigherPermission = false;

                    let permissionLevel = await this.client.DatabaseManager.getPermissionLevel(interaction.guildId, interaction.userId);
                    if (permissionLevel >= command.premissionLevel) {
                        hasHigherPermission = true;
                    }

                    interaction.member.roles.cache.forEach(async (role) => {
                        let permissionLevel = await this.client.DatabaseManager.getPermissionLevel(interaction.guildId, role.id);
                        if (permissionLevel >= command.premissionLevel) {
                            hasHigherPermission = true;
                        }
                    });

                    if (interaction.guild.ownerId === interaction.user.id) {
                        hasHigherPermission = true;
                    }

                    if (!hasHigherPermission) {
                        await interaction.reply({ content: `You need permission level ${command.premissionLevel} to use this command!`, ephemeral: true });
                        return;
                    }
                }
            }

            try {
                await command.execute(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }

        } else if (interaction.isAutocomplete()) {

            let command = this.SlashCommands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.autocomplete(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }

        } else if (interaction.isUserContextMenuCommand()) {

            const command = this.UserCommands.get(interaction.commandName);

            if (!command) return;

            try {
                if (interaction.guild) {
                    if (command.premissionLevel) {
                        let hasHigherPermission = false;

                        let userPermissionLevel = await this.client.DatabaseManager.getPermissionLevel(interaction.guildId, interaction.userId);
                        if (userPermissionLevel >= command.premissionLevel) {
                            hasHigherPermission = true;
                        }

                        interaction.member.roles.cache.forEach(async (role) => {
                            let permissionLevel = await this.client.DatabaseManager.getPermissionLevel(interaction.guildId, role.id);
                            if (permissionLevel >= command.premissionLevel) {
                                hasHigherPermission = true;
                            }
                        });

                        if (interaction.guild.ownerId === interaction.user.id) {
                            hasHigherPermission = true;
                        }

                        if (!hasHigherPermission) {
                            await interaction.reply({ content: `You need permission level ${command.premissionLevel} to use this command!`, ephemeral: true });
                            return;
                        }
                    }
                }
                await command.execute(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }

    async onMessage(message: Message) {

        if (message.author.bot) return;
        if (!message.content.startsWith(env.PREFIX)) return;

        let args = message.content.slice(env.PREFIX.length).trim().split(/ +/);
        let commandName = args.shift()?.toLowerCase();
        if (!commandName) return;

        let command = this.PrefixCommands.get(commandName);
        if (!command) return;

        let commandOptions: CommandOptions = {
            commandName: commandName,
            auther: message.author.id,
            args
        }

        try {
            if (message.guildId) {
                if (command.premissionLevel) {
                    let hasHigherPermission = false;

                    let permissionLevel = await this.client.DatabaseManager.getPermissionLevel(message.guildId, message.author.id);
                    if (permissionLevel >= command.premissionLevel) {
                        hasHigherPermission = true;
                    }

                    message.member.roles.cache.forEach(async (role) => {
                        let permissionLevel = await this.client.DatabaseManager.getPermissionLevel(message.guildId, role.id);
                        if (permissionLevel >= command.premissionLevel) {
                            hasHigherPermission = true;
                        }
                    });

                    if (message.guild.ownerId === message.author.id) {
                        hasHigherPermission = true;
                    }

                    if (!hasHigherPermission) {
                        await message.reply({ content: `You need permission level ${command.premissionLevel} to use this command!`});
                        return;
                    }
                }
            }
            await command.execute(message, commandOptions, this.client);
        } catch (error) {
            console.error(error);
            await message.reply('There was an error while executing this command!');
        }
    }
}