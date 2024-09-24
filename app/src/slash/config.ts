import { KiwiClient } from "../client";

import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder
} from "discord.js";
import { SlashCommand } from "../types/command";
import { Emojis } from "../emojis";

import { ConfigSelectMenu } from "../selectmenus/config";

/**
 * @type {SlashCommand}
 */
export const ConfigSlash: SlashCommand = {
    config: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Manage server coniguration"),
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {KiwiClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        if (interaction.user.id !== interaction.guild.ownerId) {
            interaction.reply({
                content: "You must be the server owner to use this command",
                ephemeral: true
            });
            return;
        }

        const guildConfig = await client.DatabaseManager.getGuildConfig(interaction.guildId);

        if (!guildConfig) {
            await client.DatabaseManager.createGuildConfig(interaction.guildId);
        }

        var SelectMenu = ConfigSelectMenu.config as StringSelectMenuBuilder;
        SelectMenu.setCustomId(`${ConfigSelectMenu.customId}?+${interaction.user.id}`);
        var row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(SelectMenu);

        var owner = await client.users.fetch(interaction.guild.ownerId);
        var embedDescription = [
            `${Emojis.ReplyTop} **Owner:** ${owner.displayName} (${owner.username})`,
            `${Emojis.ReplyMiddle} **Members:** ${interaction.guild.memberCount}`,
            `${Emojis.ReplyBottom} **Ping:** ${Math.round(client.ws.ping)}ms`,
        ];

        var em = new EmbedBuilder()
            .setTitle(`${client.capitalize(interaction.guild.name)} Configuration`)
            .setThumbnail(interaction.guild.iconURL())
            .setDescription(embedDescription.join("\n"))
            .setFooter({ text: `${client.capitalize(interaction.user.displayName)} (${interaction.user.username})`, iconURL: interaction.user.avatarURL() });
        interaction.reply({ embeds: [em], components: [row] });
    },
}