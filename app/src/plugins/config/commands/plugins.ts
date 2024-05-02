import {
    AutocompleteInteraction,
	ChatInputCommandInteraction
} from "discord.js";

import { KiwiClient } from "../../../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
	Permissions,
    Command
} from "../../../types/command";

import { dataSource } from "../../../data/datasource";
import { GuildPlugins } from "../../../data/entities/GuildPlugins";

export const PluginsCmd: Command = {
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

    async autocomplete(interaction: AutocompleteInteraction, client: KiwiClient) {
        const choices = new Array();
        for (var plugin of client.PluginManager.plugins) {
            if (plugin.config.disableable) choices.push(plugin.config.name);
        }

        const focusedValue = interaction.options.getFocused();
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
    },

	/**
    * 
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient) {
        const GuildPluginsRepository = await dataSource.getRepository(GuildPlugins);

        switch (interaction.options.getSubcommand()) {
            case "set":
                var pluginName = interaction.options.getString("plugin");
                var enabled = interaction.options.getBoolean("enabled");

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