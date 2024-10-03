import { 
    ButtonBuilder,
    ButtonStyle,
    ButtonInteraction
} from "discord.js";
import { KiwiClient } from "../../../client";
import { Button, CustomOptions } from "../../../types/component";

/**
 * @type {Button}
 */
export const ConfigCancelButton: Button = {
    customId: 'config-cancel',
    config: new ButtonBuilder()
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Danger),
    execute: async (interaction: ButtonInteraction, options: CustomOptions, client: KiwiClient) => {
        interaction.message.delete();
    }
}