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
export const ConfigCommands: Button = {
    customId: 'config-commands',
    config: new ButtonBuilder()
        .setLabel('Commands')
        .setStyle(ButtonStyle.Success),
    execute: async (interaction: ButtonInteraction, options: CustomOptions, client: KiwiClient) => {
        interaction.reply({ content: "This doesn't exist yet", ephemeral: true } );
    }
}