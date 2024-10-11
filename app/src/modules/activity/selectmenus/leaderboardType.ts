import { 
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    StringSelectMenuInteraction
} from "discord.js";
import { KiwiClient } from "../../../client";
import { CustomOptions, SelectMenu } from "../../../types/component";

import { getLeaderboardPage } from "../utils/getLeaderboardPage";

/**
 * @type {SelectMenu}
 */
export const LeaderboardSelectMenu: SelectMenu = {
    customId: 'leaderboard-type',
    config: new StringSelectMenuBuilder()
        .setPlaceholder('Leaderboard')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Voice Leaderboard')
                .setValue('voice'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Message Leaderboard')
                .setValue('message')
        ),
    execute: async (interaction: StringSelectMenuInteraction, options: CustomOptions, client: KiwiClient) => {
        var page = await getLeaderboardPage(client, { 
            guildId: interaction.guildId,
            pageId: interaction.values[0],
            pageOwner: interaction.user,
            user: await client.users.fetch(options.userId)
        });
        interaction.update({ content: page.content, components: [...page.rows] });
    }
}