import { 
    ButtonBuilder,
    ButtonStyle,
    ButtonInteraction
} from "discord.js";
import { KiwiClient } from "../../../client";
import { Button, CustomOptions } from "../../../types/component";

import { GuildModuleEntity } from "../../../entities/GuildModule";

import { getPage } from "../utils/getPage";

/**
 * @type {Button}
 */
export const ConfigToggleButton: Button = {
    customId: 'config-toggle',
    config: new ButtonBuilder()
        .setLabel('Toggle')
        .setStyle(ButtonStyle.Primary),
    execute: async (interaction: ButtonInteraction, options: CustomOptions, client: KiwiClient) => {
        var module = await client.db.repos.guildModules
            .findOneBy({ guildId: interaction.guild.id, moduleId: options.optionOne });
        if (module) {
            await client.db.repos.guildModules.delete(module);
        } else {
            module = new GuildModuleEntity();
            module.guildId = interaction.guild.id;
            module.moduleId = options.optionOne;
            await client.db.repos.guildModules.save(module);
        }

        var page = await getPage(client, { 
            guildId: interaction.guildId,
            pageId: options.optionOne,
            pageOwner: interaction.user 
        });
        interaction.update({ embeds: [...page.embeds], components: [...page.rows] });
    }
}