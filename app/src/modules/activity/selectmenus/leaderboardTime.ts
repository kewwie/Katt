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
export const LeaderboardTimeSelectMenu: SelectMenu = {
    customId: 'leaderboard-time',
    config: new StringSelectMenuBuilder()
        .setPlaceholder('Select Leaderboard Time')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Total')
                .setValue('total'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Daily')
                .setValue('daily')
        ),
    execute: async (interaction: StringSelectMenuInteraction, options: CustomOptions, client: KiwiClient) => {
        var page = await getLeaderboardPage(client, { 
            guildId: interaction.guildId,
            pageId: options.optionOne,
            time: interaction.values[0],
            pageOwner: interaction.user,
            user: await client.users.fetch(options.userId)
        });
        interaction.update({ content: page.content, components: [...page.rows] });
    }
}