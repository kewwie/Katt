
import { 
    RoleSelectMenuBuilder,
    RoleSelectMenuInteraction
} from "discord.js";
import { KiwiClient } from "../client";
import { CustomOptions, SelectMenu } from "../types/component";

/**
 * @type {SelectMenu}
 */
export const ConfigRoleSelectMenu: SelectMenu = {
    customId: 'config-role',
    config: new RoleSelectMenuBuilder()
        .setMinValues(0),
    execute: async (interaction: RoleSelectMenuInteraction, options: CustomOptions, client: KiwiClient) => {
        switch (options.optionOne) {
            case "activity": {

                if (options.optionTwo == "mostActiveRole") {
                    var actConf = await client.DatabaseManager.getActivityConfig(interaction.guild.id);
                    if (interaction.values[0]) {
                        actConf.mostActiveRole = interaction.values[0];
                    } else {
                        actConf.mostActiveRole = null;
                    }
                    await client.DatabaseManager.saveActivityConfig(actConf);
                }
                
                break;
            }
        }

        var page = await client.PageManager.generateConfigPage(options.optionOne, interaction);
        interaction.update({ embeds: [...page.embeds], components: [...page.rows] });
    }
}