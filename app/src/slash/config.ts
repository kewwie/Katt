import { KiwiClient } from "../client";

import { dataSource } from "../datasource";
import { GuildConfigEntity } from "../entities/GuildConfig";

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
} from "../types/command";

/**
 * @type {SlashCommand}
 */
export const ConfigSlash: SlashCommand = {
    config: {
        name: "config",
        description: "Config Commands",
        type: CommandTypes.ChatInput,
        defaultMemberPermissions: Permissions.ManageGuild,
        contexts: [SlashCommandContexts.Guild],
        integration_types: [IntegrationTypes.Guild],
        options: [
            {
                type: OptionTypes.SubCommand,
                name: "set",
                description: "Set an option for the server (Admin only)",
                options: [
                    {
                        type: OptionTypes.String,
                        name: "option",
                        description: "The Option to set",
                        autocomplete: true,
                        required: true
                    },
                    {
                        type: OptionTypes.String,
                        name: "value",
                        description: "The Value to set option to",
                        autocomplete: true,
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SubCommand,
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
                    { name: "Level One", value: "level_one" },
                    { name: "Level Two", value: "level_two" },
                    { name: "Level Three", value: "level_three" },
                    { name: "Level Four", value: "level_four" },
                    { name: "Level Five", value: "level_five" },
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
                    { name: "level_one", types: ["role"] },
                    { name: "level_two", types: ["role"] },
                    { name: "level_three", types: ["role"] },
                    { name: "level_four", types: ["role"] },
                    { name: "level_five", types: ["role"] },
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
                    var GuildVoices = (await interaction.guild.channels.fetch())
                        .filter(channel => channel.type === ChannelType.GuildVoice)
                        .filter(channel => channel.name.toLowerCase().startsWith(focused.value.toLowerCase().replace("#", "")));
                    choices.push(GuildVoices.map(channel => ({ name: "🔊 "+channel.name, value: channel.id })));
                }

                if (optionTypes.includes("stage_channel")) {
                    var GuildStageVoices = (await interaction.guild.channels.fetch())
                        .filter(channel => channel.type === ChannelType.GuildStageVoice)
                        .filter(channel => channel.name.toLowerCase().startsWith(focused.value.toLowerCase().replace("#", "")));
                    choices.push(GuildStageVoices.map(channel => ({ name: "🎧 "+channel.name, value: channel.id })));
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

                await interaction.respond(choices.flat().slice(0, 25));
            }
        }
    },
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {KiwiClient} client
     */
    async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        if (interaction.user.id !== interaction.guild.ownerId) {
            interaction.reply({
                content: "You must be the server owner to use this command",
                ephemeral: true
            });
            return;
        }

        const guildConfig = await client.DatabaseManager.getGuildConfig(interaction.guildId);

        switch (interaction.options.getSubcommand()) {
            case "set":
                var option = interaction.options.get("option");
                var value = interaction.options.getString("value");

                switch (option.value) {
                    case "log_channel":
                        if (value) {
                            guildConfig.logChannel = value;
                        } else {
                            guildConfig.logChannel = null;
                        }
                        break;

                    case "pending_channel":
                        if (value) {
                            guildConfig.pendingChannel = value;
                        } else {
                            guildConfig.pendingChannel = null;
                        }
                        break;

                    case "verification_ping":
                        if (value) {
                            guildConfig.verificationPing = value;
                        } else {
                            guildConfig.verificationPing = null;
                        }
                        break;

                    case "level_one":
                        if (value) {
                            guildConfig.levelOne = value;
                        } else {
                            guildConfig.levelOne = null;
                        }
                        break;

                    case "level_two":
                        if (value) {
                            guildConfig.levelTwo = value;
                        } else {
                            guildConfig.levelTwo = null;
                        }
                        break;

                    case "level_three":
                        if (value) {
                            guildConfig.levelThree = value;
                        } else {
                            guildConfig.levelThree = null;
                        }
                        break;

                    case "level_four":
                        if (value) {
                            guildConfig.levelFour = value;
                        } else {
                            guildConfig.levelFour = null;
                        }
                        break;

                    case "level_five":
                        if (value) {
                            guildConfig.levelFive = value;
                        } else {
                            guildConfig.levelFive = null;
                        }
                        break;

                    case "customvoice_category":
                        if (value) {
                            guildConfig.customCategory = value;
                        } else {
                            guildConfig.customCategory = null;
                        }
                        break;

                    case "customvoice_channel":
                        if (value) {
                            guildConfig.customChannel = value;
                        } else {
                            guildConfig.customChannel = null;
                        }
                        break;
                }

                await client.DatabaseManager.saveGuildConfig(guildConfig);
                await interaction.reply({
                    content: `Updated **${option.value}** successfully!`,
                    ephemeral: true
                });
                break;

            case "view":
                var rows = new Array();

                for (let [key, value] of Object.entries(guildConfig)) {
                    if (key === "guildId") continue;
                    if (key === "_id") continue;

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