import { 
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    StringSelectMenuInteraction
} from "discord.js";
import { KiwiClient } from "../../../client";

import { CustomOptions, SelectMenu } from "../../../types/component";
import { getPage } from "../utils/getPage";

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
                .setDescription('The server overview')
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
                .setLabel('List')
                .setValue('list'),
        ),
    execute: async (interaction: StringSelectMenuInteraction, options: CustomOptions, client: KiwiClient) => {
        var page = await getPage(client, { 
            guildId: interaction.guildId,
            pageId: interaction.values[0],
            pageOwner: interaction.user 
        });
        interaction.update({ embeds: [...page.embeds], components: [...page.rows] });
    }
}