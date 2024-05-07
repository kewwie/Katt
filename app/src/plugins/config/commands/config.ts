import { KiwiClient } from "../../../client";
import { dataSource } from "../../../data/datasource";
import { Guild } from "../../../data/entities/Guild";

import {
    ChatInputCommandInteraction
} from "discord.js";


import {
    CommandTypes,
    SlashCommandContexts,
    IntegrationTypes,
    ChannelTypes,
    OptionTypes,
    Permissions,
    Command
} from "../../../types/command";


/**
 * Represents the configuration command.
 */
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
                name: "verification_ping",
                description: "The role to ping when a user joins the server",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to ping on new users",
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
            {
                type: OptionTypes.SUB_COMMAND,
                name: "vanity",
                description: "Set the server vanity for the server",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "vanity",
                        description: "The role to assign to admins",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "view",
                description: "View the server configuration"
            }
        ]
    },

    /**
     * Executes the configuration command.
     * @param {ChatInputCommandInteraction} interaction - The command interaction.
     * @param {KiwiClient} client - The Kiwi client.
     * @returns {Promise<void>}
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
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
            case "verification_ping":
                var roleId = interaction.options.getRole("role").id;
                await GuildRepository.upsert(
                    { guildId: interaction.guildId, verificationPing: roleId },
                    ["guildId"]
                )
                await interaction.reply({
                    content: `Verification Ping has been set to <@&${roleId}>!`,
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
            
            case "vanity":
                var vanity = interaction.options.getString("vanity");
                await GuildRepository.upsert(
                    { guildId: interaction.guildId, vanity },
                    ["guildId"]
                )
                await interaction.reply({
                    content: "Vanity url has been set to `vanity`!",
                    ephemeral: true
                });
                break;
            
            case "view":
                var guild = await GuildRepository.findOne({ where: { guildId: interaction.guildId } });
                await interaction.reply({
                    content: `Logs Channel: <#${guild.logsChannel}>\nPending Channel: <#${guild.pendingChannel}>\nVerification Ping: <@&${guild.verificationPing}>\nGuest Role: <@&${guild.guestRole}>\nMember Role: <@&${guild.memberRole}>\nBot Role: <@&${guild.botRole}>\nAdmin Role: <@&${guild.adminRole}>`,
                    ephemeral: true,
                    allowedMentions: { users: [], roles: [] }
                });
                break;
        }
    },
}