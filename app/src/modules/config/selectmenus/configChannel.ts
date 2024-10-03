
import { 
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType
} from "discord.js";
import { KiwiClient } from "../../../client";
import { CustomOptions, SelectMenu } from "../../../types/component";

import { getPage } from "../utils/getPage";

/**
 * @type {SelectMenu}
 */
export const ConfigChannelSelectMenu: SelectMenu = {
    customId: 'config-channel',
    execute: async (interaction: ChannelSelectMenuInteraction, options: CustomOptions, client: KiwiClient) => {
        switch (options.optionOne) {
            case "activity": {
                var actConf = await client.db.repos.activityConfig
                    .findOne({ where: { guildId: interaction.guild.id }});

                if (options.optionTwo == "logChannel") {
                    if (interaction.values[0]) {
                        actConf.logChannel = interaction.values[0];
                    } else {
                        actConf.logChannel = null;
                    }
                }

                await client.db.repos.activityConfig.save(actConf);
                break;
            }

            case "list": {
                var listConf = await client.db.repos.listConfig
                    .findOne({ where: { guildId: interaction.guild.id }});

                if (options.optionTwo == "logChannel") {
                    if (interaction.values[0]) {
                        listConf.logChannel = interaction.values[0];
                    } else {
                        listConf.logChannel = null;
                    }
                }

                await client.db.repos.listConfig.save(listConf);
                break;
            }
        }

        var page = await getPage(client, { 
            guildId: interaction.guildId,
            pageId: options.optionOne,
            pageOwner: interaction.user 
        });
        interaction.update({ embeds: [...page.embeds], components: [...page.rows] });
    }
}