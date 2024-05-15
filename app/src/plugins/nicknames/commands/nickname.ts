import {
	ChatInputCommandInteraction
} from "discord.js";

import { KiwiClient } from "../../../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
    ChannelTypes,
	OptionTypes,
	Permissions,
    Command
} from "../../../types/command";

import { dataSource } from "../../../data/datasource";
import { Nickname } from "../../../data/entities/Nickname";

/**
 * @type {Command}
 */
export const NicknameCmd: Command = {
	config: {
        name: "nickname",
        description: "Nickname Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageGuild,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "save",
                description: "Saves a users nickname",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user to save the nickname for",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "save-all",
                description: "Saves every users nickname",
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "set",
                description: "Set a users nickname",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "nickname",
                        description: "The nickname to set",
                        required: true
                    },
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user to save the nickname for",
                        required: false
                    }
                ]
            }
        ]
    },

	/**
    * 
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient) {
        const NicknameRepository = await dataSource.getRepository(Nickname);

        switch (interaction.options.getSubcommand()) {
            case "save": {
                var user = interaction.options.getUser("user");
                var member = interaction.guild.members.cache.get(user.id);

                if (!member.nickname) {
                    interaction.reply("User does not have a nickname");
                    return;
                }

                await NicknameRepository.upsert(
                    { userId: user.id, guildId: interaction.guildId, nickname: member.nickname },
                    ["userId", "guildId"]
                );
                interaction.reply(`Saved **${user.username}**'s nickname`);
                break;
            }
            case "save-all": {
                for (var member of interaction.guild.members.cache.values()) {

                    if (member.nickname) {
                        await NicknameRepository.upsert(
                            { userId: member.id, guildId: interaction.guildId, nickname: member.nickname },
                            ["userId", "guildId"]
                        );
                    }
                }
                interaction.reply("Saved all users nicknames");
                    
                break;
            }
            case "set": {
                var user = interaction.options.getUser("user");
                var nickname = interaction.options.getString("nickname");

                await NicknameRepository.upsert(
                    { userId: user.id, guildId: interaction.guildId, nickname: nickname },
                    ["userId", "guildId"]
                );

                interaction.guild.members.cache.get(user.id).setNickname(nickname);

                interaction.reply(`Set **${user.username}**'s nickname to **${nickname}**`);

                break;
            }
        }
	},
}