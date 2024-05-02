/**
 * @fileoverview Command module to handle blacklisting users.
 * @module BlacklistCmd
 */

import {
    ChatInputCommandInteraction,
    AutocompleteInteraction
} from "discord.js";

import { 
    CommandTypes,
    SlashCommandContexts,
    IntegrationTypes,
    OptionTypes,
    Permissions,
    Command
} from "../../../types/command";
import { KiwiClient } from "../../../client";

import { dataSource } from "../../../data/datasource";
import { Blacklist } from "../../../data/entities/Blacklist";
import { Guild } from "../../../data/entities/Guild";

/**
 * Represents the Blacklist command module.
 * @constant {Command} BlacklistCmd
 */
export const BlacklistCmd: Command = {
    /**
     * Configuration object for the Blacklist command.
     * @type {Object}
     * @property {string} name - The name of the command.
     * @property {string} description - The description of the command.
     * @property {CommandTypes} type - The type of the command.
     * @property {Permissions} default_member_permissions - The default permissions required by members to execute the command.
     * @property {Array<SlashCommandContexts>} contexts - The context(s) in which the command is available.
     * @property {Array<IntegrationTypes>} integration_types - The integration types in which the command is available.
     * @property {Array<Object>} options - The options for the command.
     */
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
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "view",
                description: "View the blacklist",
            }
        ]
    },

    async autocomplete(interaction: AutocompleteInteraction, client: KiwiClient) {
        const BlacklistRepository = await dataSource.getRepository(Blacklist);
        const choices = new Array();

        for (var u of await BlacklistRepository.find({ where: { guildId: interaction.guild.id } })) {
            choices.push({ username: u.username, id: u.userId});
        }

        const focusedValue = interaction.options.getFocused();
        const filtered = choices.filter(choice => choice.username.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice.username, value: choice.id })),
		);
    },

    /**
     * Executes the Blacklist command.
     * @async
     * @param {ChatInputCommandInteraction} interaction - The interaction object representing the command interaction.
     * @param {KiwiClient} client - The Discord client.
     * @returns {Promise<void>}
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        const BlacklistRepository = await dataSource.getRepository(Blacklist);
        const GuildRepository = await dataSource.getRepository(Guild);

        switch (interaction.options.getSubcommand()) {
            case "add": {
                var user = interaction.options.getUser("user");
                if (!user) {
                    interaction.reply("User not found");
                    return;
                }
                var userTag = await client.getTag({ username: user.username, discriminator: user.discriminator });

                if (user.bot) {
                    interaction.reply("Bots cannot be blacklisted");
                    return;
                }

                const isMember = await interaction.guild.members.cache.has(user.id);
                if (isMember) {
                    const guild = await GuildRepository.findOne({ where: { guildId: interaction.guild.id } });
                    var isAdmin = false;
                    if (guild) {
                        isAdmin = (await interaction.guild.members.fetch(user)).roles.cache.has(guild.adminRole);
                    }
                    var isOwner = interaction.guild.ownerId === user.id;
                    var isHigher = (await interaction.guild.members.fetch(user)).roles.highest.comparePositionTo((await interaction.guild.members.fetch(interaction.user.id)).roles.highest) >= 0;
                    var appRole = (await interaction.guild.members.fetch(user)).roles.highest.comparePositionTo(interaction.guild.members.me.roles.highest) >= 0;

                    if (isAdmin || isOwner || isHigher || appRole) {
                        interaction.reply("You cannot blacklist this user");
                        return;
                    }
                }
                
                const blacklistUser = await BlacklistRepository.findOne(
                    { where: { guildId: interaction.guild.id, userId: user.id } }
                );
                if (blacklistUser) {
                    interaction.reply(`**${userTag}** is already blacklisted`);
                    return;
                };

                if (isMember) {
                    await interaction.guild.members.kick(user.id);
                }

                await BlacklistRepository.insert({
                    guildId: interaction.guild.id,
                    userId: user.id,
                    username: user.username,
                    createdBy: interaction.user.id
                });

                interaction.reply(`**${userTag}** has been added to the blacklist`);
                break;
            }
            case "remove": {
                var userId = interaction.options.getString("user");
                if (!userId) {
                    interaction.reply("User not found");
                    return;
                };
                var user = await client.users.fetch(userId);
                var userTag = await client.getTag({ username: user.username, discriminator: user.discriminator });

                const blacklistUser = await BlacklistRepository.findOne(
                    { where: { guildId: interaction.guild.id, userId: user.id } }
                );
                if (!blacklistUser) {
                    interaction.reply(`**${userTag}** is not blacklisted`);
                    return;
                };
                
                await BlacklistRepository.delete({ guildId: interaction.guild.id, userId: user.id })
                interaction.reply(`**${userTag}** has been removed from the blacklist`);
                break;
            }
            case "view": {
                const blacklistedUsers = await BlacklistRepository.find(
                    { where: { guildId: interaction.guild.id } }
                );
                if (!blacklistedUsers) {
                    interaction.reply("No users have been whitelisted");
                    return;
                }

                interaction.reply(`**Blacklisted Users**\n${blacklistedUsers.map(user => `${user.username}`).join("\n")}`);
                break;
            }
        }
    }
}