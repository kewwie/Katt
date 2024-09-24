import { 
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    StringSelectMenuInteraction,
    EmbedBuilder,
    ActionRowBuilder
} from "discord.js";
import { KiwiClient } from "../client";
import { Emojis } from "../emojis";

import { SelectMenu } from "../types/component";

import { ConfigCancel } from "../buttons/config-cancel";
import { ConfigToggle } from "../buttons/config-toggle";
import { ConfigCommands } from "../buttons/config-commands";

/**
 * @type {SelectMenu}
 */
export const ConfigSelectMenu: SelectMenu = {
    customId: 'config-type',
    config: new StringSelectMenuBuilder()
        .setPlaceholder('Config Module')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Permissions')
                .setValue('permissions'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Activity')
                .setValue('activity'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Verification')
                .setValue('verification'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Lists')
                .setValue('lists'),
        ),
    execute: async (interaction: StringSelectMenuInteraction, client: KiwiClient) => {
        var rows = [];
        var em = new EmbedBuilder()
            .setTitle(`${client.capitalize(interaction.guild.name)} Configuration`)
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({ text: `${client.capitalize(interaction.user.displayName)} (${interaction.user.username})`, iconURL: interaction.user.avatarURL() });

        var SelectMenu = ConfigSelectMenu.config as StringSelectMenuBuilder;
        SelectMenu.setCustomId(`${ConfigSelectMenu.customId}?+${interaction.user.id}`);

        var cancelButton = ConfigCancel.config;
        cancelButton.setCustomId(`${ConfigCancel.customId}?+${interaction.user.id}`);

        switch (interaction.values[0]) {
            case 'permissions':
                var isEnabled = await client.DatabaseManager.isModuleEnabled(interaction.guildId, 'permissions');
                var embedDescription = [
                    `### Permissions Module`,
                    `${Emojis.ReplyTop} **Enabled:** ${isEnabled ? 'True' : 'False'}`,
                    `${Emojis.ReplyBottom} **Status:** Not Released`,
                ];

                var configToggleButton = ConfigToggle.config;
                configToggleButton.setCustomId(`${ConfigToggle.customId}?permissions+${interaction.user.id}`);
                var commandsButton = ConfigCommands.config;
                commandsButton.setCustomId(`${ConfigCommands.customId}?permissions+${interaction.user.id}`);

                rows.push(new ActionRowBuilder()
                    .addComponents(
                        configToggleButton,
                        commandsButton,
                        cancelButton
                    )
                );

                SelectMenu.options.forEach(option => {
                    if (option.data.value === 'permissions') {
                        option.setDefault(true);
                    } else {
                        option.setDefault(false);
                    }
                });
                break;

            case 'activity':
                var isEnabled = await client.DatabaseManager.isModuleEnabled(interaction.guildId, 'activity');
                var embedDescription = [
                    `### Activity Module`,
                    `${Emojis.ReplyTop} **Enabled:** ${isEnabled ? 'True' : 'False'}`,
                    `${Emojis.ReplyBottom}`,
                ];

                var configToggleButton = ConfigToggle.config;
                configToggleButton.setCustomId(`${ConfigToggle.customId}?activity+${interaction.user.id}`);
                var commandsButton = ConfigCommands.config;
                commandsButton.setCustomId(`${ConfigCommands.customId}?activity+${interaction.user.id}`);

                rows.push(new ActionRowBuilder()
                    .addComponents(
                        configToggleButton,
                        commandsButton,
                        cancelButton
                    )
                );

                SelectMenu.options.forEach(option => {
                    if (option.data.value === 'activity') {
                        option.setDefault(true);
                    } else {
                        option.setDefault(false);
                    }
                });
                break;

            case 'verification':
                var embedDescription = [
                    `### Verification Module`,
                    `${Emojis.ReplyTop}`,
                    `${Emojis.ReplyMiddle}`,
                    `${Emojis.ReplyBottom}`,
                ];

                var configToggleButton = ConfigToggle.config;
                configToggleButton.setCustomId(`${ConfigToggle.customId}?verification+${interaction.user.id}`);
                var commandsButton = ConfigCommands.config;
                commandsButton.setCustomId(`${ConfigCommands.customId}?verification+${interaction.user.id}`);

                rows.push(new ActionRowBuilder()
                    .addComponents(
                        configToggleButton,
                        commandsButton,
                        cancelButton
                    )
                );

                SelectMenu.options.forEach(option => {
                    if (option.data.value === 'verification') {
                        option.setDefault(true);
                    } else {
                        option.setDefault(false);
                    }
                });
                break;

            case 'lists':
                var embedDescription = [
                    `### Lists Module`,
                    `${Emojis.ReplyTop}`,
                    `${Emojis.ReplyMiddle}`,
                    `${Emojis.ReplyBottom}`,
                ];
                
                var configToggleButton = ConfigToggle.config;
                configToggleButton.setCustomId(`${ConfigToggle.customId}?lists+${interaction.user.id}`);
                var commandsButton = ConfigCommands.config;
                commandsButton.setCustomId(`${ConfigCommands.customId}?lists+${interaction.user.id}`);

                rows.push(new ActionRowBuilder()
                    .addComponents(
                        configToggleButton,
                        commandsButton,
                        cancelButton
                    )
                );

                SelectMenu.options.forEach(option => {
                    if (option.data.value === 'lists') {
                        option.setDefault(true);
                    } else {
                        option.setDefault(false);
                    }
                });
                break;
        }
        
        
        var row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(SelectMenu);
        rows.push(row);

        em.setDescription(embedDescription.join("\n"));
        interaction.update({ embeds: [em], components: rows });
    }
}