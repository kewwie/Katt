
import { 
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    ChannelType
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
        .setChannelTypes(ChannelType.GuildText),
    execute: async (interaction: ChannelSelectMenuInteraction, options: CustomOptions, client: KiwiClient) => {
        switch (options.optionOne) {
            case "activity": {
                var actConf = await client.DatabaseManager.getActivityConfig(interaction.guild.id);

                if (options.optionTwo == "logChannel") {
                    if (interaction.values[0]) {
                        actConf.logChannel = interaction.values[0];
                    } else {
                        actConf.logChannel = null;
                    }
                }

                if (options.optionTwo == "mostActiveRole") {
                    if (interaction.values[0]) {
                        actConf.mostActiveRole = interaction.values[0];
                    } else {
                        actConf.mostActiveRole = null;
                    }
                }

                await client.DatabaseManager.saveActivityConfig(actConf);
                break;
            }

            case "list": {
                var listConf = await client.DatabaseManager.getListConfig(interaction.guild.id);

                if (options.optionTwo == "logChannel") {
                    if (interaction.values[0]) {
                        listConf.logChannel = interaction.values[0];
                    } else {
                        listConf.logChannel = null;
                    }
                }

                await client.DatabaseManager.saveListConfig(listConf);
                break;
            }
        }

        var page = await client.PageManager.generateConfigPage(options.optionOne, interaction);
        interaction.update({ embeds: [...page.embeds], components: [...page.rows] });
    }
}