import {
    AutocompleteInteraction,
	ChatInputCommandInteraction,
    EmbedBuilder
} from "discord.js";

import { KiwiClient } from "../../../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
	Permissions,
    SlashCommand
} from "../../../types/command";

import { dataSource } from "../../../datasource";
import { GuildBlacklistEntity } from "../../../entities/GuildBlacklist";
import { GuildUserEntity } from "../../../entities/GuildUser";

/**
 * @type {SlashCommand}
 */
export const BlacklistSlash: SlashCommand = {
	config: {
        name: "blacklist",
        description: "Blacklist Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageGuild,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "add",
                description: "Add a user to the blacklist",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user to add to the blacklist",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "remove",
                description: "Remove a user from the blacklist",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "user",
                        description: "The user to remove from the blacklist",
                        autocomplete: true,
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "view",
                description: "View the servers blacklist",
            }
        ]
    },

     /**
     * @param {AutocompleteInteraction} interaction
     * @param {KiwiClient} client
     */
     async autocomplete(interaction: AutocompleteInteraction, client: KiwiClient) {
        const BlacklistRepository = await dataSource.getRepository(GuildBlacklistEntity);
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const choices = await BlacklistRepository.find({ where: { guildId: interaction.guild.id } });
        const filtered = choices
            .filter(choice => choice.userName.toLowerCase().startsWith(focusedValue) || choice.userId.toLowerCase().startsWith(focusedValue))
            .reduce((unique, choice) => {
                const existingChoice = unique.find(c => c.userId === choice.userId);
                if (!existingChoice) {
                    unique.push(choice);
                }
                return unique;
            }, []);
            
		await interaction.respond(
			filtered.map(choice => ({ name: `${choice.userName} (${choice.userId})`, value: choice.userId })),
		);
    },

	/**
    * 
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient) {
        const BlacklistRepository = await dataSource.getRepository(GuildBlacklistEntity);
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);

        switch (interaction.options.getSubcommand()) {
            case "add": {
                let user = interaction.options.getUser("user");
                let member = interaction.guild.members.cache.get(user.id);

                if (!member) {
                    interaction.reply("User not found");
                    return;
                }

                var self = await GuildUserRepository.findOne({ where: { guildId: interaction.guild.id, userId: interaction.user.id } });
                var u = await GuildUserRepository.findOne({ where: { guildId: interaction.guild.id, userId: user.id } });
                if (self?.level <= u?.level) {
                    interaction.reply("You cannot blacklist someone of a higher level than yourself");
                    return;
                }


                var isBlacklisted = await BlacklistRepository.findOne(
                    { where: { guildId: interaction.guild.id, userId: user.id } }
                );

                if (isBlacklisted) {
                    interaction.reply("User is already blacklisted");
                    return;
                }

                await BlacklistRepository.insert({
                    guildId: interaction.guild.id,
                    userId: user.id,
                    userName: user.username,
                    modId: interaction.user.id,
                    modName: interaction.user.username
                });
                interaction.reply(`Added the user to the blacklist`);

                let BlacklistedEmbed = new EmbedBuilder()
                    .setTitle("You have been blacklisted")
                    .setThumbnail(interaction.guild.iconURL())
                    .addFields(
                        { name: "Server ID", value: interaction.guild.id },
                        { name: "Server Name", value: interaction.guild.name }
                    )
                    .setFooter({ text: "Sorry!" })
                    .setColor(0xFF474D);

                await member.send({ embeds: [BlacklistedEmbed] }).catch(() => {});
                member.kick(`Blacklisted by ${interaction.user.username}`).catch(() => {});
                break;
            }

            case "remove": {
                let user = interaction.options.getString("user");

                var isBlacklisted = await BlacklistRepository.findOne(
                    { where: { guildId: interaction.guild.id, userId: user } }
                );

                if (!isBlacklisted) {
                    interaction.reply("User is not blacklisted");
                    return;
                }

                await BlacklistRepository.delete({ guildId: interaction.guild.id, userId: user });
                interaction.reply(`Removed the user from the blacklist`);
                break;
            }

            case "view": {
                var ServerBlacklist = await BlacklistRepository.find(
                    { where: { guildId: interaction.guild.id } }
                );

                if (ServerBlacklist.length === 0) {
                    interaction.reply("No users are blacklisted");
                    return;
                }

                var blacklist = ServerBlacklist.map((bl) => {
                    return `**${bl.userName}** (${bl.userId}) - **${bl.modName}** (${bl.modId})`;
                }).join("\n");
                interaction.reply(`# Blacklist\n${blacklist}`);
                break;
            }
        }
	},
}