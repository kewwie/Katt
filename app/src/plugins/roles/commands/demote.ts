import {
    ActionRowBuilder,
    AutocompleteInteraction,
	ButtonBuilder,
	ChatInputCommandInteraction
} from "discord.js";

import { KiwiClient } from "../../../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
    SlashCommand,
    Permissions
} from "../../../types/command";

import { dataSource } from "../../../datasource";
import { GuildUserEntity } from "../../../entities/GuildUser";

import { KickUser } from "../buttons/kick-user";
import { CancelKick } from "../buttons/cancel-kick";

/**
 * @type {SlashCommand}
 */
export const PromoteSlash: SlashCommand = {
	config: {
        name: "demote",
        description: "Demote a user to a lower level",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageGuild,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                name: "user",
                description: "The user you want to promote",
                type: OptionTypes.STRING,
                autocomplete: true,
                required: true,
            }
        ]
    },

    /**
    * @param {AutocompleteInteraction} interaction
    * @param {KiwiClient} client
    */
    async autocomplete(interaction: AutocompleteInteraction, client: KiwiClient) {
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        let self = await GuildUserRepository.findOne({ where: { guildId: interaction.guild.id, userId: interaction.user.id } });

        let choices = (await GuildUserRepository.find({ where: { guildId: interaction.guild.id } }))
            .filter(choice => choice.level < 4 && choice.level <= self.level - 1);
        let focusedValue = interaction.options.getFocused().toLowerCase();
        let filtered = choices.filter(choice => choice.userName.toLowerCase().startsWith(focusedValue) || choice.userId.toLowerCase().startsWith(focusedValue));
        await interaction.respond(
			filtered.map(choice => ({ name: `${choice.userName} (${choice.userId}) - Level ${choice.level}`, value: choice.userId })),
		);
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        var userId = interaction.options.getString("user");

        if (userId === interaction.user.id) {
            interaction.reply("You cannot demote yourself");
            return;
        }

        var self = await GuildUserRepository.findOne({ where: { guildId: interaction.guild.id, userId: interaction.user.id } });
        var user = await GuildUserRepository.findOne({ where: { guildId: interaction.guild.id, userId: userId } });

        if (!self) {
            interaction.reply("You are not in the database");
            return;
        }

        if (!user) {
            interaction.reply("User not found");
            return;
        }

        if (self.level <= user.level) {
            interaction.reply("You cannot demote someone thats a higher level than yourself");
            return;
        }

        if (user.level == 5) {
            interaction.reply(`**${client.capitalize(user.userName)}** is the owner of the server and cannot be demoted`);
            return;
        }

        if ((user.level - 1) <= 0) {
            var rows = new Array();
            rows.push(new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder(KickUser.config)
                        .setCustomId("kick-user_" + user.userId + "_" + interaction.user.id),
                ])
                .addComponents([
                    new ButtonBuilder(CancelKick.config)
                        .setCustomId("cancel-kick_" + user.userId + "_" + interaction.user.id),
                ])
            );
            interaction.reply({ content: `**${client.capitalize(user.userName)}** do you want to kick this user?`, components: rows });
        } else {
            GuildUserRepository.update({ guildId: interaction.guild.id, userId: userId }, { level: user.level - 1 });
            interaction.reply(`**${client.capitalize(user.userName)}** demoted to level **${user.level - 1}**`);
        }
    }
}