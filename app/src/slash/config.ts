import { KiwiClient } from "../client";

import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    StringSelectMenuBuilder
} from "discord.js";
import { SlashCommand } from "../types/command";

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
        SelectMenu.setCustomId(`config-type?+${interaction.user.id}`);
        var row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(SelectMenu);

        interaction.reply({ content: "Config", components: [row] });
    },
}