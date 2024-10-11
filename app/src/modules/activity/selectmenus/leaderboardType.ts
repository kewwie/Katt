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
export const LeaderboardTypeSelectMenu: SelectMenu = {
    customId: 'leaderboard-type',
    config: new StringSelectMenuBuilder()
        .setPlaceholder('Select Leaderboard Type')
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
            time: options.optionTwo,
            pageOwner: interaction.user
        });
        interaction.update({ content: page.content, components: [...page.rows] });
    }
}