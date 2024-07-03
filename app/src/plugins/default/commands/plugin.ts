import { KiwiClient } from "../../../client";

import { dataSource } from "../../../datasource";
import { GuildPluginEntity } from "../../../entities/GuildPlugin";

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
    SlashCommand
} from "../../../types/command";


/**
 * @type {SlashCommand}
 */
export const PluginSlash: SlashCommand = {
    config: {
        name: "plugin",
        description: "Plugin Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageGuild,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "enable",
                description: "Enable an plugin to the server (Owner Only)",
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
                name: "disable",
                description: "Disable an plugin from the server (Owner Only)",
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
     * @param {AutocompleteInteraction} interaction
     * @param {KiwiClient} client
     */
    async autocomplete(interaction: AutocompleteInteraction, client: KiwiClient) {
        const GuildPluginRepository = await dataSource.getRepository(GuildPluginEntity);

        const choices = [];
        for (const plugin of client.PluginManager.plugins) {
            if (plugin.config.disableable) {
                switch (interaction.options.getSubcommand()) {
                    case "enable": {
                        var pl = await GuildPluginRepository.findOne({ where: { guildId: interaction.guildId, pluginName: plugin.config.name }})
                        if (!pl) {
                            choices.push(plugin.config.name);
                        }
                        break;
                    }
                    case "disable": {
                        var pl = await GuildPluginRepository.findOne({ where: { guildId: interaction.guildId, pluginName: plugin.config.name }})
                        if (pl) {
                            choices.push(plugin.config.name);
                        }
                        break;
                    }
                }
            }
        }

        const focusedValue = interaction.options.getFocused().toLowerCase();
        const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {KiwiClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient) {
        if (interaction.user.id !== interaction.guild.ownerId) {
            interaction.reply({
                content: "You must be the server owner to use this command",
                ephemeral: true
            });
            return;
        }


        const GuildPluginRepository = await dataSource.getRepository(GuildPluginEntity);

        switch (interaction.options.getSubcommand()) {
            case "enable":
                var pluginName = interaction.options.getString("plugin");

                if (!client.PluginManager.plugins.find(plugin => plugin.config.name === pluginName).config.disableable) {
                    interaction.reply("Invalid plugin name");
                    return;
                }

                var existingPlugin = await GuildPluginRepository.findOne({ where: { guildId: interaction.guildId, pluginName: pluginName }});

                if (existingPlugin) {
                    interaction.reply({ content: `The plugin **${pluginName}** is already enabled`, ephemeral: true });
                    return;
                }

                await GuildPluginRepository.insert({ guildId: interaction.guildId, pluginName: pluginName });

                interaction.reply({
                    content: `Enabled **${pluginName}** plugin`,
                    ephemeral: true
                });
                break;

            case "disable":
                var pluginName = interaction.options.getString("plugin");

                if (!client.PluginManager.plugins.find(plugin => plugin.config.name === pluginName).config.disableable) {
                    interaction.reply("Invalid plugin name");
                    return;
                }

                var existingPlugin = await GuildPluginRepository.findOne({ where: { guildId: interaction.guildId, pluginName: pluginName }});

                if (!existingPlugin) {
                    interaction.reply({ content: `The plugin **${pluginName}** is already disabled`, ephemeral: true });
                    return;
                }

                await GuildPluginRepository.delete({ guildId: interaction.guildId, pluginName: pluginName });

                interaction.reply({
                    content: `Disabled **${pluginName}** plugin`,
                    ephemeral: true
                });
                break;

            case "list":
                var gPlugins = await GuildPluginRepository.find({ where: { guildId: interaction.guildId } });
                
                var allPlugins = client.PluginManager.plugins
                    .filter(plugin => plugin.config.disableable)

                var enabledPlugins = allPlugins
                    .filter(plugin => gPlugins.some(gp => gp.pluginName === plugin.config.name))
                    .map(plugin => `- ${plugin.config.name}`);

                const disablePlugins = allPlugins
                    .filter(plugin => !gPlugins.some(gp => gp.pluginName === plugin.config.name))
                    .map(plugin => `- ${plugin.config.name}`);

                interaction.reply({
                    content: `**Enabled Plugins**\n${enabledPlugins.join("\n")}\n\n**Disabled Plugins**\n${disablePlugins.join("\n")}`,
                    ephemeral: true
                });
                break;
        }
    },
}