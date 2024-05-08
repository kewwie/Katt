import {
	ChatInputCommandInteraction
} from "discord.js";

import { KiwiClient } from "../../../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
    Command,
    Permissions
} from "../../../types/command";

import { dataSource } from "../../../data/datasource";
import { GuildAdmins } from "../../../data/entities/GuildAdmins";
import { Events } from "../../../types/event";

export const AdminCmd: Command = {
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
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user you want to remove as an admin",
                        required: true
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

                await GuildAdminsRepository.upsert({
                    guildId: interaction.guild.id,
                    userId: user.id,
                    username: user.username,
                    level: level
                }, ["guildId", "userId"]);

                client.emit(Events.GuildAdminAdd, interaction.guild, user);

                interaction.reply({ 
                    content: `Added **${user.username}** as an admin with **level ${level}**`,
                    ephemeral: true
                });
                
                break;
            }

            case "remove": {
                var user = interaction.options.getUser("user");

                var res = await GuildAdminsRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        userId: user.id
                    }
                });

                if (!res) {
                    interaction.reply({
                        content: `**${user.username}** is not an admin`,
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

                await GuildAdminsRepository.delete({
                    guildId: interaction.guild.id,
                    userId: user.id
                });

                client.emit(Events.GuildAdminRemove, interaction.guild, user);

                interaction.reply({
                    content: `Removed **${user.username}** as an admin`,
                    ephemeral: true
                });
                break;
            }

            case "list": {
                var admins = await GuildAdminsRepository.find({
                    where: {
                        guildId: interaction.guild.id
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
                    return `**${admin.userId}** - Level ${admin.level}`;
                });

                interaction.reply({
                    content: `**Admins**\n${adminList.join("\n")}`,
                    ephemeral: true
                });
                break;
            }
        }
    }
}