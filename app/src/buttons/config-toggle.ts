import { 
    ButtonBuilder,
    ButtonStyle,
    ButtonInteraction
} from "discord.js";
import { KiwiClient } from "../client";
import { Button } from "../types/component";

/**
 * @type {Button}
 */
export const ConfigToggle: Button = {
    customId: 'config-toggle',
    config: new ButtonBuilder()
        .setLabel('Toggle')
        .setStyle(ButtonStyle.Primary),
    execute: async (interaction: ButtonInteraction, client: KiwiClient) => {
        var moduleName = interaction.customId;
        console.log(moduleName);
        var isEnabled = await client.DatabaseManager.isModuleEnabled(interaction.guild.id, moduleName);
        if (isEnabled) {
            await client.DatabaseManager.disableGuildModule(interaction.guild.id, moduleName);
            interaction.reply({ content: `Disabled ${moduleName} module`, ephemeral: true });
        } else {
            await client.DatabaseManager.enableGuildModule(interaction.guild.id, moduleName);
            interaction.reply({ content: `Enabled ${moduleName} module`, ephemeral: true });
        }
    }
}