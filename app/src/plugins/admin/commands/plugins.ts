import { KiwiClient } from "../../../client";

import { dataSource } from "../../../data/datasource";
import { GuildPlugins } from "../../../data/entities/GuildPlugins";
import { GuildAdmins } from "../../../data/entities/GuildAdmins";

import {
    AutocompleteInteraction,
    ChatInputCommandInteraction
} from "discord.js";

import {
    CommandTypes,
    SlashCommandContexts,
    IntegrationTypes,
    OptionTypes,
    Permissions,
    Command
} from "../../../types/command";


/**
 * Represents the Plugins command.
 * @type {Command}
 */
export const PluginsCmd: Command = {
    /**
     * The configuration for the Plugins command.
     * @type {object}
     */
    config: {
        name: "plugins",
        description: "Plugins Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageGuild,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "add",
                description: "Add an plugin to the server (Owner Only)",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "plugin",
                        description: "The plugin you want to enable",
                        autocomplete: true,
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "remove",
                description: "Remove an plugin from the server (Owner Only)",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "plugin",
                        description: "The plugin you want to disable",
                        autocomplete: true,
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "list",
                description: "List all plugins for the server (Owner Only)"
            }
        ]
    },

    /**
     * Autocomplete handler for the Plugins command.
     * @param {AutocompleteInteraction} interaction - The autocomplete interaction.
     * @param {KiwiClient} client - The Kiwi client.
     * @returns {Promise<void>}
     */
    async autocomplete(interaction: AutocompleteInteraction, client: KiwiClient) {
        const GuildPluginsRepository = await dataSource.getRepository(GuildPlugins);

        const choices = [];
        for (const plugin of client.PluginManager.plugins) {
            if (plugin.config.disableable) {
                switch (interaction.options.getSubcommand()) {
                    case "add": {
                        var pl = await GuildPluginsRepository.findOne({ where: { guild_id: interaction.guildId, plugin: plugin.config.name }})
                        if (!pl) {
                            choices.push(plugin.config.name);
                        }
                        break;
                    }
                    case "remove": {
                        var pl = await GuildPluginsRepository.findOne({ where: { guild_id: interaction.guildId, plugin: plugin.config.name }})
                        if (pl) {
                            choices.push(plugin.config.name);
                        }
                        break;
                    }
                }
            }
        }

        const focusedValue = interaction.options.getFocused();
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },

    /**
     * Execute handler for the Plugins command.
     * @param {ChatInputCommandInteraction} interaction - The command interaction.
     * @param {KiwiClient} client - The Kiwi client.
     * @returns {Promise<void>}
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient) {
        const GuildAdminsRepository = await dataSource.getRepository(GuildAdmins);
        var guildAdmin = await GuildAdminsRepository.findOne({ where: { guildId: interaction.guild.id, userId: interaction.user.id } });

        if (guildAdmin.level < 3) {
            interaction.reply({ content: "You must be the server owner to use this command", ephemeral: true });
            return;
        }

        const GuildPluginsRepository = await dataSource.getRepository(GuildPlugins);

        switch (interaction.options.getSubcommand()) {
            case "add":
                var pluginName = interaction.options.getString("plugin");

                if (!client.PluginManager.plugins.find(plugin => plugin.config.name === pluginName).config.disableable) {
                    interaction.reply("Invalid plugin name");
                    return;
                }

                var existingPlugin = await GuildPluginsRepository.findOne({ where: { guild_id: interaction.guildId, plugin: pluginName }});

                if (existingPlugin) {
                    interaction.reply(`The plugin **${pluginName}** is already active`);
                    return;
                }

                await GuildPluginsRepository.insert({ guild_id: interaction.guildId, plugin: pluginName });

                interaction.reply({
                    content: `Added **${pluginName}** plugin to the server`,
                    ephemeral: true
                });
                break;

            case "remove":
                var pluginName = interaction.options.getString("plugin");

                if (!client.PluginManager.plugins.find(plugin => plugin.config.name === pluginName).config.disableable) {
                    interaction.reply("Invalid plugin name");
                    return;
                }

                var existingPlugin = await GuildPluginsRepository.findOne({ where: { guild_id: interaction.guildId, plugin: pluginName }});

                if (!existingPlugin) {
                    interaction.reply(`The plugin **${pluginName}** is not active`);
                    return;
                }

                await GuildPluginsRepository.delete({ guild_id: interaction.guildId, plugin: pluginName });

                interaction.reply({
                    content: `Removed **${pluginName}** plugin from the server`,
                    ephemeral: true
                });
                break;

            case "list":
                var gPlugins = await GuildPluginsRepository.find({ where: { guild_id: interaction.guildId } });

                var enabledPlugins = client.PluginManager.plugins
                    .filter(plugin => gPlugins.some(gp => gp.plugin === plugin.config.name && plugin.config.disableable))
                    .map(plugin => `- ${plugin.config.name}`);

                var disablePlugins = client.PluginManager.plugins
                    .filter(plugin => gPlugins.some(gp => gp.plugin !== plugin.config.name && plugin.config.disableable))
                    .map(plugin => `- ${plugin.config.name}`);

                interaction.reply({
                    content: `**Enabled Plugins**\n${enabledPlugins.join("\n")}\n\n**Disabled Plugins**\n${disablePlugins.join("\n")}`,
                    ephemeral: true
                });
                break;
        }
    },
}