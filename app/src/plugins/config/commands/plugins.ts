import { KiwiClient } from "../../../client";
import { dataSource } from "../../../data/datasource";
import { GuildPlugins } from "../../../data/entities/GuildPlugins";

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
        default_member_permissions: Permissions.Administrator,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "set",
                description: "Set the logs channel for the server",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "plugin",
                        description: "The plugin you want to enable or disable",
                        autocomplete: true,
                        required: true
                    },
                    {
                        type: OptionTypes.BOOLEAN,
                        name: "enabled",
                        description: "Whether to enable or disable the command",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "view",
                description: "View the current configuration"
            }
        ]
    },

    /**
     * Autocomplete handler for the Plugins command.
     * @param {AutocompleteInteraction} interaction - The autocomplete interaction.
     * @param {KiwiClient} client - The Kiwi client.
     * @returns {Promise<void>}
     */
    async autocomplete(interaction, client) {
        const choices = [];
        for (const plugin of client.PluginManager.plugins) {
            if (plugin.config.disableable) choices.push(plugin.config.name);
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
    async execute(interaction, client) {
        const GuildPluginsRepository = await dataSource.getRepository(GuildPlugins);

        switch (interaction.options.getSubcommand()) {
            case "set":
                const pluginName = interaction.options.getString("plugin");
                const enabled = interaction.options.getBoolean("enabled");

                if (!client.PluginManager.plugins.find(plugin => plugin.config.name === pluginName).config.disableable) {
                    interaction.reply("Invalid plugin name");
                    return;
                }

                if (enabled) {
                    await GuildPluginsRepository.insert({ guild_id: interaction.guildId, plugin: pluginName });
                } else {
                    await GuildPluginsRepository.delete({ guild_id: interaction.guildId, plugin: pluginName });
                }

                interaction.reply(`**${enabled ? "Enabled" : "Disabled"}** **${pluginName}** plugin`);
                break;

            case "view":
                const plugins = await GuildPluginsRepository.find({ where: { guild_id: interaction.guildId } });

                if (plugins.length === 0) {
                    interaction.reply("No plugins are enabled");
                } else {
                    const pluginNames = plugins.map((plugin) => plugin.plugin);
                    interaction.reply(`Enabled Plugins: ${pluginNames.join(", ")}`);
                }
                break;
        }
    },
}