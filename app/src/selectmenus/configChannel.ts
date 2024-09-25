
import { 
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction
} from "discord.js";
import { KiwiClient } from "../client";
import { CustomOptions, SelectMenu } from "../types/component";

/**
 * @type {SelectMenu}
 */
export const ConfigChannelSelectMenu: SelectMenu = {
    customId: 'config-channel',
    config: new ChannelSelectMenuBuilder()
        .setMinValues(0)
        .setMaxValues(1),
    execute: async (interaction: ChannelSelectMenuInteraction, options: CustomOptions, client: KiwiClient) => {
        switch (options.optionOne) {
            case "activity": {

                if (options.optionTwo == "logChannel") {
                    var actConf = await client.DatabaseManager.getActivityConfig(interaction.guild.id);
                    actConf.logChannel = interaction.values[0];
                    console.log(await client.DatabaseManager.saveActivityConfig(actConf));
                }
                
                break;
            }
        }

        var page = await client.PageManager.generateConfigPage(options.optionOne, interaction);
        interaction.update({ embeds: [...page.embeds], components: [...page.rows] });
    }
}