import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { env } from "../env";
import { KiwiClient } from "../client";
import {
    PrefixCommand,
    SlashCommand,
    UserCommand,
    CommandOptions
} from "../types/command";
import { Collection, Message } from "discord.js";
import { EventList } from "../types/event";

export class CommandManager {
    public client: KiwiClient;
    public PrefixCommands: Collection<string, PrefixCommand>;
    public SlashCommands: Collection<string, SlashCommand>;
    public UserCommands: Collection<string, UserCommand>;
    private RestAPI: REST;

    public staffServerCommands: any[];
    
    constructor(client: KiwiClient) {
        this.client = client;

        this.PrefixCommands = new Collection();
        this.SlashCommands = new Collection();
        this.UserCommands = new Collection();
        this.RestAPI = new REST({ version: '10' }).setToken(env.CLIENT_TOKEN);

        this.staffServerCommands = [];

        this.client.on(EventList.InteractionCreate, this.onInteraction.bind(this));
        this.client.on(EventList.MessageCreate, this.onMessage.bind(this));
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

    async register(commands: any[], guildId?: string) {        
        if (!guildId) {
            this.RestAPI.put(
                Routes.applicationCommands(env.CLIENT_ID),
                { body: commands }
            );
        } else {
            this.RestAPI.put(
                Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
                { body: commands }
            )
        }
    }

    async unregisterAll(guildId?: string) {
        try {
            if (!guildId) {
                this.RestAPI.put(
                    Routes.applicationCommands(env.CLIENT_ID),
                    { body: [] }
                )
            }
            else {
                this.RestAPI.put(
                    Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
                    { body: [] }
                )
            }
        } catch (error) {
            console.log(error);
        }
    }

    async onInteraction(interaction: any) {

        if (interaction.isChatInputCommand()) {

            let command = this.SlashCommands.get(interaction.commandName);

            if (!command) return;

            try {
                /*if (interaction.guildId) {
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
                }*/
                if (interaction.guildId && command.module && !command.module?.default) {
                    let isEnabled = await this.client.db.repos.guildModules
                        .findOneBy({ guildId: interaction.guildId, moduleId: command.module.id });
                    if (!isEnabled) {
                        interaction.reply({ content: `This command is disabled!`, ephemeral: true });
                        return;
                    }
                }
                await command.execute(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There is an issue!', ephemeral: true });
            }

        } else if (interaction.isAutocomplete()) {

            let command = this.SlashCommands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.autocomplete(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There is an issue!', ephemeral: true }); // Fix this to respond in autocomplete
            }

        } else if (interaction.isUserContextMenuCommand()) {

            const command = this.UserCommands.get(interaction.commandName);

            if (!command) return;

            try {
                /*if (interaction.guild) {
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
                }*/
                    if (interaction.guildId && command.module && !command.module?.default) {
                    let isEnabled = await this.client.db.repos.guildModules
                        .findOneBy({ guildId: interaction.guildId, moduleId: command.module.id });
                    if (!isEnabled) {
                        interaction.reply({ content: `This command is disabled!`, ephemeral: true });
                        return;
                    }
                }
                await command.execute(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There is an issue!', ephemeral: true });
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
            /*if (message.guildId) {
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
            }*/
                if (message.guildId && command.module && !command.module?.default) {
                let isEnabled = await await this.client.db.repos.guildModules
                    .findOneBy({ guildId: message.guildId, moduleId: command.module.id });
                if (!isEnabled) {
                    message.reply({ content: `This command is disabled!` });
                    return;
                }
            }
            await command.execute(message, commandOptions, this.client);
        } catch (error) {
            console.error(error);
            await message.reply('There is an issue!');
        }
    }
}