import {
	UserContextMenuCommandInteraction
} from "discord.js";

import { KiwiClient } from "../../../client";

import { 
	CommandTypes,
    UserCommand
} from "../../../types/command";

import { dataSource } from "../../../datasource";
import { VoiceActivityEntity } from "../../../entities/VoiceActivity";

/**
 * @type {UserCommand}
 */
export const VoiceActivityUser: UserCommand = {
	config: {
        name: "View Voice Activity",
        type: CommandTypes.USER
    },

	/**
    * @param {UserContextMenuCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: UserContextMenuCommandInteraction, client: KiwiClient): Promise<void> {
        const VoiceActivityRepository = await dataSource.getRepository(VoiceActivityEntity);

        const formatter = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        });

        var voiceActivity = await VoiceActivityRepository.findOne(
            { where: { userId: interaction.targetId, guildId: interaction.guild.id } }
        );

        if (!voiceActivity || voiceActivity.seconds < 0) {
            interaction.reply("No voice activity found for this user");
            return;
        }
        
        var hours = voiceActivity.seconds / (60 * 60);
        interaction.reply(`**${voiceActivity.userName}** has been in voice chat for **${formatter.format(hours)}** hours`);
    }
}