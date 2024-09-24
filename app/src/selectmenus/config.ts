import { 
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    MessageContextMenuCommandInteraction
} from "discord.js";
import { KiwiClient } from "../client";
import { SelectMenu } from "../types/component";

/**
 * @type {SelectMenu}
 */
export const ConfigSelectMenu: SelectMenu = {
    config: new StringSelectMenuBuilder()
        .setCustomId('config-type')
        .setPlaceholder('Config Page')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Main')
                .setValue('main'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Permissions')
                .setValue('permissions'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Logging')
                .setValue('logging'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Activity')
                .setValue('activity'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Verification')
                .setValue('verification'),
        ),
    execute: async (interaction: any, client: KiwiClient) => {
        interaction.reply("ok");
    }
}