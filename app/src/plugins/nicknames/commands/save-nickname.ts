import {
	UserContextMenuCommandInteraction
} from "discord.js";

import { KiwiClient } from "../../../client";

import { 
	CommandTypes,
    UserCommand
} from "../../../types/command";

import { dataSource } from "../../../datasource";
import { NicknameEntity } from "../../../entities/Nickname";

/**
 * @type {UserCommand}
 */
export const SaveNicknameUser: UserCommand = {
	config: {
        name: "Save User Nickname",
        type: CommandTypes.USER,
    },

	/**
    * 
    * @param {UserContextMenuCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: UserContextMenuCommandInteraction, client: KiwiClient) {
        const NicknameRepository = await dataSource.getRepository(NicknameEntity);

        var member = await interaction.guild.members.fetch(interaction.targetId);

        if (member && !member.nickname) {
            interaction.reply("Member does not have a nickname");
            return;
        }

        await NicknameRepository.upsert(
            { userId: member.id, guildId: interaction.guildId, name: member.nickname },
            ["userId", "guildId"]
        );
        interaction.reply(`Saved **${client.capitalize(member.user.username)}**s nickname as **${member.nickname}**`);
	}
}