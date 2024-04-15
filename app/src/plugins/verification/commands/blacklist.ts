import {
    ChatInputCommandInteraction
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

export const BlacklistCmd: Command = {
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
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user to remove from the blacklist",
                        required: true
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

    /**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        const BlacklistRepository = await dataSource.getRepository(Blacklist);

        switch (interaction.options.getSubcommand()) {
            case "add": {
                var user = interaction.options.getUser("user");
                if (!user) {
                    interaction.reply("User not found");
                    return;
                }
                var userTag = await client.getTag({name: user.username, discriminator: user.discriminator});
                
                const blacklistUser = await BlacklistRepository.findOne(
                    { where: { guildId: interaction.guild.id, userId: user.id } }
                );
                if (blacklistUser) {
                    interaction.reply(`**${userTag}** is already blacklisted`);
                    return;
                };

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
                var user = interaction.options.getUser("user");
                if (!user) {
                    interaction.reply("User not found");
                    return;
                };
                var userTag = await client.getTag({name: user.username, discriminator: user.discriminator});

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