import { KiwiClient } from "../../../client";

import { dataSource } from "../../../data/datasource";
import { GuildConfig } from "../../../data/entities/GuildConfig";
import { GuildAdmins } from "../../../data/entities/GuildAdmins";

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
import { env } from "../../../env";

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
                name: "logs",
                description: "Set the logs channel for the server (Owner only)",
                options: [
                    {
                        type: OptionTypes.CHANNEL,
                        name: "channel",
                        description: "The channel to send logs to",
                        channel_types: [ChannelTypes.GUILD_TEXT],
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "pending",
                description: "Set the pending channel for the server (Owner only)",
                options: [
                    {
                        type: OptionTypes.CHANNEL,
                        name: "channel",
                        description: "The channel to send join request in",
                        channel_types: [ChannelTypes.GUILD_TEXT],
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "verification_ping",
                description: "The role to ping when a user joins the server (Owner only)",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to ping on new users",
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "guest",
                description: "Set the guest role for the server (Owner only)",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to assign to guests",
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "member",
                description: "Set the member role for the server (Owner only)",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to assign to members",
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "bot",
                description: "Set the bot role for the server (Owner only)",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to assign to bots",
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "admin",
                description: "Set the admin role for the server (Owner only)",
                options: [
                    {
                        type: OptionTypes.ROLE,
                        name: "role",
                        description: "The role to assign to admins",
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "vanity",
                description: "Set the server vanity for the server (Owner only)",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "vanity",
                        description: "The role to assign to admins",
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "view",
                description: "View the server configuration (Owner only)"
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
        const GuildAdminsRepository = await dataSource.getRepository(GuildAdmins);
        var guildAdmins = await GuildAdminsRepository.find({ where: { guildId: interaction.guild.id } });

        if (guildAdmins.find(admin => admin.userId === interaction.user.id)?.level < 3) {
            interaction.reply({ content: "You must be the server owner to use this command", ephemeral: true });
            return;
        }

        const GuildRepository = await dataSource.getRepository(GuildConfig);

        switch (interaction.options.getSubcommand()) {
            case "logs":
                var channel = interaction.options.getChannel("channel");
                var value = channel ? channel.id : null;

                await GuildRepository.upsert(
                    { guildId: interaction.guildId, logsChannel: value },
                    ["guildId"]
                )
                
                if (value) {
                    await interaction.reply({
                        content: `Logs channel has been set to <#${value}>!`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `Logs channel has been unset!`,
                        ephemeral: true
                    });
                }
                break;

            case "pending":
                var channel = interaction.options.getChannel("channel");
                var value = channel ? channel.id : null;

                await GuildRepository.upsert(
                    { guildId: interaction.guildId, pendingChannel: value },
                    ["guildId"]
                )
               
                if (value) {
                    await interaction.reply({
                        content: `Pending channel has been set to <#${value}>!`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `Pending channel has been unset!`,
                        ephemeral: true
                    });
                }
                break;
                
            case "verification_ping":
                var role = interaction.options.getRole("role");
                var value = role ? role.id : null;

                await GuildRepository.upsert(
                    { guildId: interaction.guildId, verificationPing: value },
                    ["guildId"]
                )

                if (value) {
                    await interaction.reply({
                        content: `Verification Ping has been set to <@&${value}>!`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `Verification Ping has been unset!`,
                        ephemeral: true
                    });
                }
                break;

            case "guest":
                var role = interaction.options.getRole("role");
                var value = role ? role.id : null;

                await GuildRepository.upsert(
                    { guildId: interaction.guildId, guestRole: value },
                    ["guildId"]
                )

                if (value) {
                    await interaction.reply({
                        content: `Guest role has been set to <@&${value}>!`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `Guest role has been unset!`,
                        ephemeral: true
                    });
                }
                break;

            case "member":
                var role = interaction.options.getRole("role");
                var value = role ? role.id : null;

                await GuildRepository.upsert(
                    { guildId: interaction.guildId, memberRole: value },
                    ["guildId"]
                )
                
                if (value) {
                    await interaction.reply({
                        content: `Member role has been set to <@&${value}>!`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `Member role has been unset!`,
                        ephemeral: true
                    });
                }
                break;

            case "bot":
                var role = interaction.options.getRole("role");
                var value = role ? role.id : null;

                await GuildRepository.upsert(
                    { guildId: interaction.guildId, botRole: value },
                    ["guildId"]
                );

                if (value) {
                    await interaction.reply({
                        content: `Bot role has been set to <@&${value}>!`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `Bot role has been unset!`,
                        ephemeral: true
                    });
                }  
                break;

            case "admin":
                var role = interaction.options.getRole("role");
                var value = role ? role.id : null;

                await GuildRepository.upsert(
                    { guildId: interaction.guildId, adminRole: value },
                    ["guildId"]
                );

                if (value) {
                    await interaction.reply({
                        content: `Admin role has been set to <@&${value}>!`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `Admin role has been unset!`,
                        ephemeral: true
                    });
                }
                break;
            
            case "vanity":
                var vanity = interaction.options.getString("vanity");

                if (vanity) {
                    const existingGuild = await GuildRepository.findOne({ where: { vanity } });
                    if (existingGuild) {
                        await interaction.reply({
                            content: "Vanity is already in use!",
                            ephemeral: true
                        });
                        return;
                    }
                    await GuildRepository.upsert(
                        { guildId: interaction.guildId, vanity },
                        ["guildId"]
                    )
                    await interaction.reply({
                        content: "Vanity url has been set to `" + `${env.URL}/join/${vanity}` + "`",
                        ephemeral: true
                    });
                } else {
                    await GuildRepository.upsert(
                        { guildId: interaction.guildId, vanity },
                        ["guildId"]
                    )
                    await interaction.reply({
                        content: "Vanity url has been unset!",
                        ephemeral: true
                    });
                }
                break;
            
            case "view":
                var guild = await GuildRepository.findOne({ where: { guildId: interaction.guildId } });
                if (!guild) {
                    await interaction.reply({
                        content: "No configuration found for this server!",
                        ephemeral: true
                    });
                    return;
                }

                var rows = new Array();

                if (guild.logsChannel) {
                    rows.push(`**Logs Channel**\n<#${guild.logsChannel}>`);
                } else {
                    rows.push(`**Logs Channel**\nNot Set`);
                }

                if (guild.pendingChannel) {
                    rows.push(`**Pending Channel**\n<#${guild.pendingChannel}>`);
                } else {
                    rows.push(`**Pending Channel**\nNot Set`);
                }

                if (guild.verificationPing) {
                    rows.push(`**Verification Ping**\n<@&${guild.verificationPing}>`);
                } else {
                    rows.push(`**Verification Ping**\nNot Set`);
                }

                if (guild.guestRole) {
                    rows.push(`**Guest Role**\n<@&${guild.guestRole}>`);
                } else {
                    rows.push(`**Guest Role**\nNot Set`);
                }

                if (guild.memberRole) {
                    rows.push(`**Member Role**\n<@&${guild.memberRole}>`);
                } else {
                    rows.push(`**Member Role**\nNot Set`);
                }

                if (guild.botRole) {
                    rows.push(`**Bot Role**\n<@&${guild.botRole}>`);
                } else {
                    rows.push(`**Bot Role**\nNot Set`);
                }

                if (guild.adminRole) {
                    rows.push(`**Admin Role**\n<@&${guild.adminRole}>`);
                } else {
                    rows.push(`**Admin Role**\nNot Set`);
                }

                if (guild.vanity) {
                    rows.push("**Vanity**\n`" + `${env.URL}/join/${guild.vanity}` + "`");
                } else {
                    rows.push(`**Vanity**\nNot Set`);
                }

                await interaction.reply({
                    content: rows.join("\n\n"),
                    ephemeral: true,
                    allowedMentions: { users: [], roles: [] }
                });
                break;
        }
    },
}