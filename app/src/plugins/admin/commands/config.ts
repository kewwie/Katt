import { KiwiClient } from "../../../client";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildAdminEntity } from "../../../entities/GuildAdmin";

import {
    AutocompleteInteraction,
    ChannelType,
    ChatInputCommandInteraction
} from "discord.js";


import {
    CommandTypes,
    SlashCommandContexts,
    IntegrationTypes,
    OptionTypes,
    Permissions,
    SlashCommand
} from "../../../types/command";

/**
 * @type {SlashCommand}
 */
export const ConfigCmd: SlashCommand = {
    config: {
        name: "config",
        description: "Config Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageGuild,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "set",
                description: "Set an option for the server (Admin only)",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "option",
                        description: "The Option to set",
                        autocomplete: true,
                        required: true
                    },
                    {
                        type: OptionTypes.STRING,
                        name: "value",
                        description: "The Value to set option to",
                        autocomplete: true,
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "view",
                description: "View the server configuration (Admin only)"
            }
        ]
    },

    /**
     * @param {AutocompleteInteraction} interaction
     * @param {KiwiClient} client
     */
    async autocomplete(interaction: AutocompleteInteraction, client: KiwiClient) {
        const focused = interaction.options.getFocused(true);

        switch (focused.name) {
            case "option": {
                const options = [
                    { name: "Log Channel", value: "log_channel" },
                    { name: "Pending Channel", value: "pending_channel" },
                    { name: "Verification Ping", value: "verification_ping" },
                    { name: "Guest Role", value: "guest_role" },
                    { name: "Member Role", value: "member_role" },
                    { name: "Admin Role", value: "admin_role" },
                    { name: "CustomVoice Category", value: "customvoice_category" },
                    { name: "CustomVoice Channel", value: "customvoice_channel" }
                ];

                await interaction.respond(
                    options.filter(option => option.name.toLowerCase().startsWith(focused.value.toLowerCase())),
                );
                break;
            }

            case "value": {
                const valueTypes = [
                    { name: "log_channel", types: ["text_channel"] },
                    { name: "pending_channel", types: ["text_channel"] },
                    { name: "verification_ping", types: ["role"] },
                    { name: "guest_role", types: ["role"] },
                    { name: "member_role", types: ["role"] },
                    { name: "admin_role", types: ["role"] },
                    { name: "customvoice_category", types: ["category"] },
                    { name: "customvoice_channel", types: ["voice_channel", "stage_channel"] }
                ];

                var optionTypes = valueTypes.find(type => type.name === interaction.options.get("option").value).types;
                var choices = new Array();

               
                if (optionTypes.includes("text_channel")) {
                    var channels = (await interaction.guild.channels.fetch())
                        .filter(channel => channel.type === ChannelType.GuildText)
                        .filter(channel => channel.name.toLowerCase().startsWith(focused.value.toLowerCase().replace("#", "")));
                    choices.push(channels.map(channel => ({ name: "#"+channel.name, value: channel.id })));
                }

                if (optionTypes.includes("voice_channel")) {
                    var channels = (await interaction.guild.channels.fetch())
                        .filter(channel => channel.type === ChannelType.GuildVoice)
                        .filter(channel => channel.name.toLowerCase().startsWith(focused.value.toLowerCase().replace("#", "")));
                    choices.push(channels.map(channel => ({ name: "🔊 "+channel.name, value: channel.id })));
                }

                if (optionTypes.includes("stage_channel")) {
                    var channels = (await interaction.guild.channels.fetch())
                        .filter(channel => channel.type === ChannelType.GuildStageVoice)
                        .filter(channel => channel.name.toLowerCase().startsWith(focused.value.toLowerCase().replace("#", "")));
                    choices.push(channels.map(channel => ({ name: "🎧 "+channel.name, value: channel.id })));
                }

                if (optionTypes.includes("role")) {
                    var roles = (await interaction.guild.roles.fetch()).filter(role => role.name !== "@everyone")
                        .filter(role => role.name.toLowerCase().startsWith(focused.value.toLowerCase().replace("@", "")));
                    choices.push(roles.map(role => ({ name: "@"+role.name, value: role.id })))
                }

                if (optionTypes.includes("category")) {
                    var categories = (await interaction.guild.channels.fetch())
                        .filter(channel => channel.type === ChannelType.GuildCategory)
                        .filter(category => category.name.toLowerCase().startsWith(focused.value.toLowerCase()));
                    choices.push(categories.map(category => ({ name: category.name, value: category.id })));
                }

                if (optionTypes.includes("member")) {
                    var members = (await interaction.guild.members.fetch())
                        .filter(member => member.user.username.toLowerCase().startsWith(focused.value.toLowerCase().replace("@", "")));
                    choices.push(members.map(member => ({ name: "@"+member.user.username, value: member.user.id })));
                }

                await interaction.respond(choices.flat());
            }
        }
    },
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {KiwiClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        const GuildAdminRepository = await dataSource.getRepository(GuildAdminEntity);
        var guildAdmin = await GuildAdminRepository.findOne({ where: { guildId: interaction.guild.id, userId: interaction.user.id } });

        if (!guildAdmin || guildAdmin.level < 3) {
            interaction.reply({ content: "You must be the server owner to use this command", ephemeral: true });
            return;
        }

        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);

        switch (interaction.options.getSubcommand()) {
            case "set":
                var guild = await GuildConfigRepository.findOne({ where: { guildId: interaction.guildId } });
                if (!guild) {
                    guild = new GuildConfigEntity();
                    guild.guildId = interaction.guildId;
                }

                var option = interaction.options.get("option");
                var value = interaction.options.getString("value");

                switch (option.value) {
                    case "log_channel":
                        if (value) {
                            guild.logChannel = value;
                        } else {
                            guild.logChannel = null;
                        }
                        break;

                    case "pending_channel":
                        if (value) {
                            guild.pendingChannel = value;
                        } else {
                            guild.pendingChannel = null;
                        }
                        break;

                    case "verification_ping":
                        if (value) {
                            guild.verificationPing = value;
                        } else {
                            guild.verificationPing = null;
                        }
                        break;

                    case "guest_role":
                        if (value) {
                            guild.guestRole = value;
                        } else {
                            guild.guestRole = null;
                        }
                        break;

                    case "member_role":
                        if (value) {
                            guild.memberRole = value;
                        } else {
                            guild.memberRole = null;
                        }
                        break;

                    case "admin_role":
                        if (value) {
                            guild.adminRole = value;
                        } else {
                            guild.adminRole = null;
                        }
                        break;

                    case "customvoice_category":
                        if (value) {
                            guild.customCategory = value;
                        } else {
                            guild.customCategory = null;
                        }
                        break;

                    case "customvoice_channel":
                        if (value) {
                            guild.customChannel = value;
                        } else {
                            guild.customChannel = null;
                        }
                        break;
                }

                await GuildConfigRepository.save(guild);
                await interaction.reply({
                    content: `Updated **${option.value}** successfully!`,
                    ephemeral: true
                });
                break;

            case "view":
                var guild = await GuildConfigRepository.findOne({ where: { guildId: interaction.guildId } });
                if (!guild) {
                    await interaction.reply({
                        content: "No configuration found for this server!",
                        ephemeral: true
                    });
                    return;
                }

                var rows = new Array();

                for (let [key, value] of Object.entries(guild)) {
                    if (key === "guildId") continue;

                    if (value) {
                        await interaction.guild.channels.fetch(value)
                            .then(channel => {
                                value = `<#${channel.id}>`;
                            })
                            .catch(() => {});

                        await interaction.guild.roles.fetch(value)
                            .then(role => {
                                value = `<@&${role.id}>`;
                            })
                            .catch(() => {});

                        rows.push(`**${key.charAt(0).toUpperCase() + key.slice(1)}**\n${value}`);
    
                    } else {
                        rows.push(`**${key.charAt(0).toUpperCase() + key.slice(1)}**\nNone`);
                    }
                };

                await interaction.reply({
                    content: rows.join("\n\n"),
                    ephemeral: true,
                    allowedMentions: { users: [], roles: [] }
                });
                break;
        }
    },
}