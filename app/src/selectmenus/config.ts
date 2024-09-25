import { 
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    StringSelectMenuInteraction,
    EmbedBuilder,
    ActionRowBuilder
} from "discord.js";
import { KiwiClient } from "../client";

import { CustomOptions, SelectMenu } from "../types/component";

/**
 * @type {SelectMenu}
 */
export const ConfigSelectMenu: SelectMenu = {
    customId: 'config-type',
    config: new StringSelectMenuBuilder()
        .setPlaceholder('Modules')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Overview')
                .setValue('overview'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Permissions')
                .setValue('permissions'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Activity')
                .setValue('activity'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Verification')
                .setValue('verification'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Lists')
                .setValue('lists'),
        ),
    execute: async (interaction: StringSelectMenuInteraction, options: CustomOptions, client: KiwiClient) => {
        var page = await client.PageManager.generateConfigPage(interaction.values[0], interaction);
        interaction.update({ embeds: [...page.embeds], components: [...page.rows] });
    }
}