import { 
    ButtonBuilder,
    ButtonStyle,
    ButtonInteraction
} from "discord.js";
import { KiwiClient } from "../client";
import { Button, CustomOptions } from "../types/component";

/**
 * @type {Button}
 */
export const ConfigToggle: Button = {
    customId: 'config-toggle',
    config: new ButtonBuilder()
        .setLabel('Toggle')
        .setStyle(ButtonStyle.Primary),
    execute: async (interaction: ButtonInteraction, options: CustomOptions, client: KiwiClient) => {
        var isEnabled = await client.DatabaseManager.isModuleEnabled(interaction.guild.id, options.optionOne);
        if (isEnabled) {
            await client.DatabaseManager.disableGuildModule(interaction.guild.id, options.optionOne);
        } else {
            await client.DatabaseManager.enableGuildModule(interaction.guild.id, options.optionOne);
        }
        var page = await client.PageManager.generateConfigPage(options.optionOne, interaction);
        interaction.update({ embeds: [...page.embeds], components: [...page.rows] });
    }
}