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
export const ActivitySelectMenu: SelectMenu = {
    customId: 'activity-type',
    config: new StringSelectMenuBuilder()
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
    execute: async (interaction: StringSelectMenuInteraction, options: CustomOptions, client: KiwiClient) => {
        var page = await getPage(client, { 
            guildId: interaction.guildId,
            pageId: interaction.values[0],
            pageOwner: interaction.user,
            user: await client.users.fetch(options.userId)
        });
        interaction.update({ embeds: [...page.embeds], components: [...page.rows] });
    }
}