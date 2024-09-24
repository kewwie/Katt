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
export const ActivitySelectMenu: SelectMenu = {
    config: new StringSelectMenuBuilder()
        .setCustomId('activity-type?')
        .setPlaceholder('Activity Type')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Status')
                .setDescription('...')
                .setValue('status'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Presence')
                .setDescription('...')
                .setValue('precense'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Voice')
                .setDescription('...')
                .setValue('voice'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Message')
                .setDescription('...')
                .setValue('message')
        ),
    execute: async (interaction: any, client: KiwiClient) => {
        interaction.reply("ok");
    }
}