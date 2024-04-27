import { KiwiClient } from "../client";
import { Button } from "../types/component";

import { dataSource } from "../data/datasource";
import { GuildPlugins } from "../data/entities/GuildPlugins";

export class ComponentManager {
    public client: KiwiClient;

    constructor(client: KiwiClient) {
        this.client = client;
    }

    public loadButtons(buttons: Button[]) {
        for (var button of buttons) {
            this.client.buttons.set(button.config.custom_id, button);
        }
    }

    async onInteraction(interaction: any) {
        const GuildPluginsRepository = await dataSource.getRepository(GuildPlugins);

        if (interaction.isButton()) {
            const buttonId = (interaction.customId).split("_")[0];
            const button = this.client.buttons.get(buttonId);

            if (!button) return;

            try {
                if (button.plugin) {
                    if (!this.client.PluginManager.plugins.find(plugin => plugin.config.name === button.plugin).config.disableable) {
                        await button.execute(interaction, this.client);
                    } else {
                        if (interaction.guild) {
                            const status = await GuildPluginsRepository.findOne({ where: { guild_id: interaction.guild.id, plugin: button.plugin } });
                            if (status) {
                                await button.execute(interaction, this.client);
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
        }
    }
};