
import { 
    RoleSelectMenuBuilder,
    RoleSelectMenuInteraction
} from "discord.js";
import { KiwiClient } from "../../../client";
import { CustomOptions, SelectMenu } from "../../../types/component";

import { getPage } from "../utils/getPage";

/**
 * @type {SelectMenu}
 */
export const ConfigRoleSelectMenu: SelectMenu = {
    customId: 'config-role',
    execute: async (interaction: RoleSelectMenuInteraction, options: CustomOptions, client: KiwiClient) => {
        switch (options.optionOne) {
            case "activity": {

                if (options.optionTwo == "dailyActiveRole") {
                    var actConf = await client.db.repos.activityConfig
                        .findOneBy({ guildId: interaction.guildId });
                    if (interaction.values[0]) {
                        actConf.dailyActiveRole = interaction.values[0];
                    } else {
                        actConf.dailyActiveRole = null;
                    }
                    await client.db.repos.activityConfig.save(actConf);
                }

                if (options.optionTwo == "weeklyActiveRole") {
                    var actConf = await client.db.repos.activityConfig
                        .findOneBy({ guildId: interaction.guildId });
                    if (interaction.values[0]) {
                        actConf.weeklyActiveRole = interaction.values[0];
                    } else {
                        actConf.weeklyActiveRole = null;
                    }
                    await client.db.repos.activityConfig.save(actConf);
                }
                
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