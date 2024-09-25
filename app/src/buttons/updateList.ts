

import { 
    ButtonBuilder,
    ButtonStyle,
    ButtonInteraction,
    TextChannel
} from "discord.js";
import { KiwiClient } from "../client";
import { Button, CustomOptions } from "../types/component";

/**
 * @type {Button}
 */
export const ConfigToggle: Button = {
    customId: 'update-list',
    config: new ButtonBuilder()
        .setStyle(ButtonStyle.Primary),
    execute: async (interaction: ButtonInteraction, options: CustomOptions, client: KiwiClient) => {
        var listConf = await client.DatabaseManager.getListConfig(interaction.guild.id);
        var users = interaction.message.content.split("\n");

        let index = users.indexOf(options.optionOne);

        if (index !== -1) {
            users.splice(index, 1);
            users.push(options.optionOne);
        }

        var content = users.join("\n");

        interaction.message.edit({ content });
        interaction.reply({ content: `Moved **${options.optionOne}** to the bottom of the list!`, ephemeral: true });

        if (listConf.logChannel) {
            var log = await interaction.guild.channels.fetch(listConf.logChannel) as TextChannel;
            if (!log) return;
            log.send(`**${client.capitalize(interaction.user.username)}** has moved down **${options.optionOne}** in [${interaction.channel.name}](${interaction.message.url})`);
        }
    }
}