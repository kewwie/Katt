import {
    AutocompleteInteraction,
	ChatInputCommandInteraction
} from "discord.js";

import { KiwiClient } from "../../../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
    SlashCommand,
    Permissions
} from "../../../types/command";

import { dataSource } from "../../../datasource";
import { GuildAdmins } from "../../../entities/GuildAdmins";
import { Events } from "../../../types/event";

/**
 * @type {SlashCommand}
 */
export const AdminCmd: SlashCommand = {
	config: {
        name: "admin",
        description: "Admin Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageGuild,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "add",
                description: "Add an admin in the server (Owner Only)",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user you want to add as an admin",
                        required: true
                    },
                    {
                        type: OptionTypes.INTEGER,
                        name: "level",
                        description: "The level of the admin",
                        required: true,
                        choices: [
                            {
                                name: "Level 1",
                                value: 1
                            },
                            {
                                name: "Level 2",
                                value: 2
                            },
                            {
                                name: "Level 3 (Co-Owner)",
                                value: 3
                            }
                        ]
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "remove",
                description: "Remove an admin in the server (Owner Only)",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "user",
                        description: "The user you want to remove as an admin",
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "list",
                description: "List all admins in the server",
            }
        ]
    },

    /**
    * @param {AutocompleteInteraction} interaction
    * @param {KiwiClient} client
    */
    async autocomplete(interaction: AutocompleteInteraction, client: KiwiClient) {
        const GuildAdminsRepository = await dataSource.getRepository(GuildAdmins);

        const choices = [];

        for (var am of await GuildAdminsRepository.find({ where: { guildId: interaction.guildId }})) {
            if (am.level <= 3) {
                choices.push({ name: `${am.username} (Level ${am.level})`, value: `${am.userId}`});
            };
        }

        const focusedValue = interaction.options.getFocused();
        const filtered = choices.filter(choice => choice.name.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value })),
        );
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        const GuildAdminsRepository = await dataSource.getRepository(GuildAdmins);
        var guildAdmin = await GuildAdminsRepository.findOne({ where: { guildId: interaction.guild.id, userId: interaction.user.id } });

        if (!guildAdmin || guildAdmin.level < 3) {
            interaction.reply({ content: "You must be the server owner to use this command", ephemeral: true });
            return;
        }

        switch (interaction.options.getSubcommand()) {
            case "add": {
                var user = interaction.options.getUser("user");
                var level = interaction.options.getInteger("level");

                if (guildAdmin.level <= level) {
                    interaction.reply({
                        content: "You can't add an admin with a higher level than yours",
                        ephemeral: true
                    });
                    return;
                }

                if (user.bot || user.id === interaction.user.id) {
                    interaction.reply({
                        content: "You can't add a bot or yourself as an admin",
                        ephemeral: true
                    });
                    return;
                }

                var u = await GuildAdminsRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        userId: user.id
                    }
                });

                if (u) {
                    GuildAdminsRepository.update({
                        guildId: interaction.guild.id,
                        userId: user.id
                    }, { level, username: user.username });
                } else {
                    GuildAdminsRepository.insert({
                        guildId: interaction.guild.id,
                        userId: user.id,
                        username: user.username,
                        level
                    });
                }

                client.emit(Events.GuildAdminAdd, interaction.guild, user);

                interaction.reply({ 
                    content: `Added **${user.username}** as an admin with **level ${level}**`,
                    ephemeral: true
                });
                
                break;
            }

            case "remove": {
                var userId = interaction.options.getString("user");

                var res = await GuildAdminsRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        userId: userId
                    }
                });

                if (!res) {
                    interaction.reply({
                        content: `**${res.username}** is not an admin`,
                        ephemeral: true
                    });
                    return;
                }

                if (guildAdmin.level <= res.level) {
                    interaction.reply({
                        content: "You can't remove an admin with a higher level than yours",
                        ephemeral: true
                    });
                    return;
                }

                if (userId === interaction.user.id) {
                    interaction.reply({
                        content: "You can't remove yourself as an admin",
                        ephemeral: true
                    });
                    return;
                }

                await GuildAdminsRepository.delete({
                    guildId: interaction.guild.id,
                    userId: userId
                });

                var user = await client.users.fetch(userId);

                client.emit(Events.GuildAdminRemove, interaction.guild, user);

                interaction.reply({
                    content: `Removed **${res.username}** as an admin`,
                    ephemeral: true
                });
                break;
            }

            case "list": {
                var admins = await GuildAdminsRepository.find({
                    where: {
                        guildId: interaction.guild.id
                    },
                    order: {
                        level: "DESC"
                    }
                });

                if (admins.length === 0) {
                    interaction.reply({
                        content: "No admins in this server",
                        ephemeral: true
                    });
                    return;
                }

                var adminList = admins.map(admin => {
                    return `**${admin.username}** - Level ${admin.level}`;
                });

                interaction.reply({
                    content: `# Admins \n${adminList.join("\n")}`,
                    ephemeral: true
                });
                break;
            }
        }
    }
}