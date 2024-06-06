import { KiwiClient } from "../client";
import { Button } from "../types/component";

import { dataSource } from "../datasource";
import { GuildPluginEntity } from "../entities/GuildPlugin";

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
        const GuildPluginsRepository = await dataSource.getRepository(GuildPluginEntity);

        if (interaction.isButton()) {
            const buttonId = (interaction.customId).split("_")[0];
            const button = this.client.buttons.get(buttonId);

            if (!button) return;

            try {
                if (button.plugin) {
                    if (button.dms || !this.client.PluginManager.plugins.find(plugin => plugin.config.name === button.plugin).config.disableable) {
                        await button.execute(interaction, this.client);
                    } else {
                        if (interaction.guild) {
                            var isEnabled = await GuildPluginsRepository.findOne({ where: { guildId: interaction.guild.id, pluginName: button.plugin } });
                            if (isEnabled) {
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