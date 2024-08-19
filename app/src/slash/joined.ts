import {
	ChatInputCommandInteraction
} from "discord.js";

import { KiwiClient } from "../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
    SlashCommand
} from "../types/command";

import { dataSource } from "../datasource";
import { VoiceStateEntity } from "../entities/VoiceState";

/**
 * @type {SlashCommand}
 */
export const JoinedSlash: SlashCommand = {
	config: {
        name: "joined",
        description: "See when a user joined a voice channel",
        type: CommandTypes.ChatInput,
        defaultMemberPermissions: null,
        contexts: [SlashCommandContexts.Guild],
        integration_types: [IntegrationTypes.Guild],
        options: [
            {
                type: OptionTypes.User,
                name: "user",
                description: "The user you want to see the join time of",
                required: false
            }
        ]
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        const VoiceStateRepository = await dataSource.getRepository(VoiceStateEntity);
        let user = interaction.options.getUser("user") || interaction.user;
        let voiceState = await VoiceStateRepository.findOne({ where: { userId: user.id, guildId: interaction.guild.id } });

        if (!voiceState) {
            interaction.reply(`${client.capitalize(user.username)} is not in a voice channel`);
            return;
        }

        let unixTimestamp = Math.floor(voiceState.joinTime.getTime() / 1000);
        interaction.reply(`${client.capitalize(user.username)} joined the voice channel at <t:${unixTimestamp}:R>`);
    }
}