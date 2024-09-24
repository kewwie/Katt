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
export const ConfigCancel: Button = {
    customId: 'config-cancel',
    config: new ButtonBuilder()
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger),
    execute: async (interaction: ButtonInteraction, client: KiwiClient) => {
        interaction.message.delete();
    }
}