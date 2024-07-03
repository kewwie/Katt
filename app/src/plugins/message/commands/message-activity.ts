import {
	UserContextMenuCommandInteraction
} from "discord.js";

import { KiwiClient } from "../../../client";

import { 
	CommandTypes,
    UserCommand
} from "../../../types/command";

import { dataSource } from "../../../datasource";
import { MessageActivityEntity } from "../../../entities/MessageActivity";

/**
 * @type {UserCommand}
 */
export const MessageActivityUser: UserCommand = {
	config: {
        name: "View Message Activity",
        type: CommandTypes.USER
    },

	/**
    * @param {UserContextMenuCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: UserContextMenuCommandInteraction, client: KiwiClient): Promise<void> {
        const MessageActivityRepository = await dataSource.getRepository(MessageActivityEntity);

        const formatter = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        });

        var messageActivity = await MessageActivityRepository.findOne(
            { where: { userId: interaction.targetId, guildId: interaction.guild.id } }
        );

        if (!messageActivity || messageActivity.amount < 0) {
            interaction.reply("No messages found from this user");
            return;
        }
        
        interaction.reply(`**${messageActivity.userName}** has sent **${formatter.format(messageActivity.amount)}** ${messageActivity.amount === 1 ? 'message' : 'messages'} in the server`);
    }
}