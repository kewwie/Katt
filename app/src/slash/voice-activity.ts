import {
	UserContextMenuCommandInteraction
} from "discord.js";

import { KiwiClient } from "../client";

import { 
	CommandTypes,
    UserCommand
} from "../types/command";

import { dataSource } from "../datasource";
import { VoiceActivityEntity } from "../entities/VoiceActivity";

/**
 * @type {UserCommand}
 */
export const VoiceActivityUser: UserCommand = {
	config: {
        name: "View Voice Activity",
        type: CommandTypes.User
    },

	/**
    * @param {UserContextMenuCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: UserContextMenuCommandInteraction, client: KiwiClient): Promise<void> {
        const VoiceActivityRepository = await dataSource.getRepository(VoiceActivityEntity);

        const formatter = new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 0
        });

        var voiceActivity = await VoiceActivityRepository.findOne(
            { where: { userId: interaction.targetId, guildId: interaction.guild.id } }
        );

        if (!voiceActivity || voiceActivity.seconds < 0) {
            interaction.reply("No voice activity found for this user");
            return;
        }

        var timeSeconds = voiceActivity.seconds;
        var days, hours, minutes, seconds;

        days = Math.floor(timeSeconds / (24 * 60 * 60));
        timeSeconds %= 24 * 60 * 60;

        hours = Math.floor(timeSeconds / (60 * 60));
        timeSeconds %= 60 * 60;

        minutes = Math.floor(timeSeconds / 60);
        seconds = timeSeconds % 60;

        interaction.reply(`**${client.capitalize(voiceActivity.userName)}** has been in voice chat for **${formatter.format(days)}** days **${formatter.format(hours)}** hours **${formatter.format(minutes)}** minutes and **${formatter.format(seconds)}** seconds.`);
    }
}