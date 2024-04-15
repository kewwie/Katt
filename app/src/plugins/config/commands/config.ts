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
import { Guild } from "../../../data/entities/Guild";

export const ConfigCmd: Command = {
	config: {
        name: "config",
        description: "Config Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.Administrator,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "logs_channel",
                description: "Set the logs channel for the server",
                options: [
                    {
                        type: OptionTypes.CHANNEL,
                        name: "channel",
                        description: "The channel to send logs to",
                        channel_types: [ChannelTypes.GUILD_TEXT],
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "pending_channel",
                description: "Set the pending channel for the server",
                options: [
                    {
                        type: OptionTypes.CHANNEL,
                        name: "channel",
                        description: "The channel to send join request in",
                        channel_types: [ChannelTypes.GUILD_TEXT],
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "guest_role",
                description: "Set the guest role for the server",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to assign to guests",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "member_role",
                description: "Set the member role for the server",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to assign to members",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "bot_role",
                description: "Set the bot role for the server (Owner only)",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to assign to bots",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "admin_role",
                description: "Set the admin role for the server (Owner only)",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to assign to admins",
                        required: true
                    }
                ]
            },
        ]
    },

	/**
    * 
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient) {
        const GuildRepository = await dataSource.getRepository(Guild);

        switch (interaction.options.getSubcommand()) {
            case "logs_channel":
                var channelId = interaction.options.getChannel("channel").id;
                await GuildRepository.upsert(
                    { guildId: interaction.guildId, logsChannel: channelId },
                    ["guildId"]
                )
                await interaction.reply({
                    content: `Logs channel has been set to <#${channelId}>!`,
                    ephemeral: true
                });
                break;
            case "pending_channel":
                var channelId = interaction.options.getChannel("channel").id;
                await GuildRepository.upsert(
                    { guildId: interaction.guildId, pendingChannel: channelId },
                    ["guildId"]
                )
                await interaction.reply({
                    content: `Pending channel has been set to <#${channelId}>!`,
                    ephemeral: true
                });
                break;
            case "guest_role":
                var roleId = interaction.options.getRole("role").id;
                await GuildRepository.upsert(
                    { guildId: interaction.guildId, guestRole: roleId },
                    ["guildId"]
                )
                await interaction.reply({
                    content: `Guest role has been set to <@&${roleId}>!`,
                    ephemeral: true
                });
                break;
            case "member_role":
                var roleId = interaction.options.getRole("role").id;
                await GuildRepository.upsert(
                    { guildId: interaction.guildId, memberRole: roleId },
                    ["guildId"]
                )
                await interaction.reply({
                    content: `Member role has been set to <@&${roleId}>!`,
                    ephemeral: true
                });        
                break;

            case "bot_role":
                if (interaction.user.id !== interaction.guild.ownerId) {
                    await interaction.reply({
                        content: `You must be the owner of the server to set the bot role!`,
                    });
                    return;
                }

                var roleId = interaction.options.getRole("role").id;
                await GuildRepository.upsert(
                    { guildId: interaction.guildId, botRole: roleId },
                    ["guildId"]
                )
                await interaction.reply({
                    content: `Bot role has been set to <@&${roleId}>!`,
                    ephemeral: true
                });        
                break;

            case "admin_role":
                if (interaction.user.id !== interaction.guild.ownerId) {
                    await interaction.reply({
                        content: `You must be the owner of the server to set the admin role!`,
                    });
                    return;
                }

                var roleId = interaction.options.getRole("role").id;
                await GuildRepository.upsert(
                    { guildId: interaction.guildId, adminRole: roleId },
                    ["guildId"]
                )
                await interaction.reply({
                    content: `Admin role has been set to <@&${roleId}>!`,
                    ephemeral: true
                });
                break;
        }
	},
}