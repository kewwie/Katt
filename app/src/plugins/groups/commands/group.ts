import {
    ChatInputCommandInteraction,
    EmbedBuilder
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
import { Group } from "../../../data/entities/Group";

export const GroupCommand: Command =  {
	config: {
        name: "group",
        description: "Group Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageChannels,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "create",
                description: "Create a group",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "name",
                        description: "Name of the group",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "sync",
                description: "Sync all group roles with the database",
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "join",
                description: "Join a group",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "name",
                        description: "Name of the group",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "leave",
                description: "Leave a group",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "name",
                        description: "Name of the group",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND_GROUP,
                name: "member",
                description: "Manage members of a group",
                options: [
                    {
                        type: OptionTypes.SUB_COMMAND,
                        name: "add",
                        description: "Add a user to a group",
                        options: [
                            {
                                type: OptionTypes.STRING,
                                name: "name",
                                description: "Name of the group",
                                required: true
                            },
                            {
                                type: OptionTypes.USER,
                                name: "user",
                                description: "The user to add to the group",
                                required: true
                            }
                        ]
                    },
                    {
                        type: OptionTypes.SUB_COMMAND,
                        name: "remove",
                        description: "Remove a user from a group",
                        options: [
                            {
                                type: OptionTypes.STRING,
                                name: "name",
                                description: "Name of the group",
                                required: true
                            },
                            {
                                type: OptionTypes.USER,
                                name: "user",
                                description: "The user to remove from the group",
                                required: true
                            }
                        ]
                    },
                ]
            },          
            {
                type: OptionTypes.SUB_COMMAND_GROUP,
                name: "modify",
                description: "Modify a group",
                options: [
                    {
                        type: OptionTypes.SUB_COMMAND,
                        name: "color",
                        description: "Change the color of the group",
                        options: [
                            {
                                type: OptionTypes.STRING,
                                name: "name",
                                description: "Name of the group",
                                required: true
                            },
                            {
                                type: OptionTypes.STRING,
                                name: "color",
                                description: "Color of the group",
                                required: true
                            }
                        ]
                    },
                    {
                        type: OptionTypes.SUB_COMMAND,
                        name: "name",
                        description: "Change the name of the group",
                        options: [
                            {
                                type: OptionTypes.STRING,
                                name: "name",
                                description: "Name of the group",
                                required: true
                            },
                            {
                                type: OptionTypes.STRING,
                                name: "newname",
                                description: "New name of the group",
                                required: true
                            }
                        ]
                    },
                    {
                        type: OptionTypes.SUB_COMMAND,
                        name: "private",
                        description: "Change the privacy of the group",
                        options: [
                            {
                                type: OptionTypes.STRING,
                                name: "name",
                                description: "Name of the group",
                                required: true
                            },
                            {
                                type: OptionTypes.BOOLEAN,
                                name: "private",
                                description: "true or false",
                                required: true
                            }
                        ]
                    },
                    {
                        type: OptionTypes.SUB_COMMAND,
                        name: "owner",
                        description: "Transfer ownership of the group",
                        options: [
                            {
                                type: OptionTypes.STRING,
                                name: "name",
                                description: "Name of the group",
                                required: true
                            },
                            {
                                type: OptionTypes.USER,
                                name: "user",
                                description: "A user to transfer ownership to",
                                required: true
                            }
                        ]
                    },
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "list",
                description: "Lists all groups"
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "info",
                description: "Info about a group",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "name",
                        description: "Name of the group",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "delete",
                description: "Delete a group",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "name",
                        description: "Name of the group",
                        required: true
                    }
                ]
            }
        ]
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient) {
        const GroupRepository = await dataSource.getRepository(Group);

        switch (interaction.options.getSubcommand()) {
            case "create": {
                var name = interaction.options.getString('name');

                const existingGroup = await GroupRepository.findOne(
                    {
                        where: {
                            guildId: interaction.guild.id,
                            name: name
                        }
                    }
                )

                if (existingGroup) {
                    await interaction.reply("Group already exists.");
                    return;
                }
                const role = await interaction.guild.roles.create({
                    name: `Group ${name}`,
                    color: "Random",
                    mentionable: true
                });

                await interaction.guild.members.cache.get(interaction.member.user.id).roles.add(role);

                await GroupRepository.insert({
                    groupId: String(Date.now() - 1000),
                    name: name,
                    guildId: interaction.guild.id,
                    roleId: role.id,
                    ownerId: interaction.user.id,
                    admins: [{ userId: interaction.user.id }],
                    members: [{ userId: interaction.user.id }],
                    private: false
                });

                await interaction.reply(`Group ${name} has been created.`);
                break;
            }
            case "sync": {
                await interaction.reply("Groups have been synced.");
                break;
            }
            case "join": {
                var name = interaction.options.getString('name');

                const existingGroup = await GroupRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        name: name
                    }
                });

                if (existingGroup) {
                    if (existingGroup.members.some(member => member.userId === interaction.user.id)) {
                        await interaction.reply("You are already a member of this group.");
                        return;
                    }
                    await interaction.guild.members.cache.get(interaction.user.id).roles.add(existingGroup.roleId);

                    await GroupRepository.update(
                        { name: name, guildId: interaction.guild.id },
                        { members: [...existingGroup.members, { userId: interaction.user.id }] }
                    );
                    await interaction.reply(`You have joined the group ${name}.`);
                } else {
                    await interaction.reply("Group does not exist.");
                }
                break;
            }
            case "leave": {
                var name = interaction.options.getString('name');

                const existingGroup = await GroupRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        name: name
                    }
                });

                if (existingGroup) {
                    if (existingGroup.members.some(member => member.userId === interaction.user.id)) {
                        await interaction.guild.members.cache.get(interaction.user.id).roles.remove(existingGroup.roleId);
                        
                        await GroupRepository.update(
                            { name: name, guildId: interaction.guild.id },
                            { members: existingGroup.members.filter(member => member.userId !== interaction.user.id) }
                        );
                        await interaction.reply(`You have left the group ${name}.`);
                    } else {
                        await interaction.reply(`You are not a member of the group ${name}.`);
                    }
                } else {
                    await interaction.reply(`The group ${name} does not exist.`);
                }
                break;
            }
            case "add": {
                var name = interaction.options.getString('name');
                var user = interaction.options.getUser('user');

                const existingGroup = await GroupRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        name: name
                    }
                });

                if (existingGroup) {
                    if (existingGroup.admins.some(admin => admin.userId === interaction.user.id)) {
                        if (!existingGroup.members.some(member => member.userId === interaction.user.id)) {
                            await interaction.guild.members.cache.get(member.id).roles.add(existingGroup.roleId);
                            await interaction.reply(`User ${user.username} has been added to group ${name}.`);
                        } else {
                            await interaction.reply(`User ${user.username} is already a member of group ${name}.`);
                        }
                    } else {
                        await interaction.reply(`You do not have permission to add members to group ${name}.`);
                    }
                } else {
                    await interaction.reply(`Group ${name} does not exist.`);
                }
                break;
            }
            case "remove": {
                var name = interaction.options.getString('name');
                var member = interaction.options.getUser('user');

                const existingGroup = await GroupRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        name: name
                    }
                });

                if (existingGroup) {
                    if (existingGroup.admins.some(admin => admin.userId === interaction.user.id)) {
                        if (!existingGroup.members.some(member => member.userId === interaction.user.id)) {
                            await interaction.guild.members.cache.get(member.id).roles.remove(existingGroup.roleId);
                            await interaction.reply(`User ${user.username} has been removed from group ${name}.`);
                        } else {
                            await interaction.reply(`User ${user.username} is not a member of group ${name}.`);
                        }
                    } else {
                        await interaction.reply(`You do not have permission to add members to group ${name}.`);
                    }
                } else {
                    await interaction.reply(`Group ${name} does not exist.`);
                }
                break;
            }/*
            case "color": {
                var name = interaction.options.getString('name');
                var color = interaction.options.getString('color');

                const group = await client.database.db("kiwi").collection("groups").findOne({
                    name: name,
                    guildId: interaction.guild.id
                });

                if (group && group.admins.includes(interaction.member.id)) {
                    const role = interaction.guild.roles.cache.get(group.roleId);
                    if (role) {
                        await role.setColor(color);
                        await interaction.reply(`Color of group ${name} has been changed to ${color}.`);
                    } else {
                        await interaction.reply("Group role not found.");
                    }
                } else {
                    await interaction.reply("You are not the owner of this group.");
                }
                break;
            }
            case "name": {
                var name = interaction.options.getString('name');
                var newName = interaction.options.getString('newname');

                const group = await client.database.db("kiwi").collection("groups").findOne({
                    name: name,
                    guildId: interaction.guild.id,
                    ownerId: interaction.member.id
                });

                if (group && group.admins.includes(interaction.member.id)) {
                    const role = interaction.guild.roles.cache.get(group.roleId);
                    if (role) {
                        await role.edit({ name: `Group ${newName}` });
                    } else {
                        await interaction.reply("Role not found.");
                        return;
                    }
                    await client.database.db("kiwi").collection("groups").updateOne(
                        { name: name, guildId: interaction.guild.id },
                        { $set: { name: newName } }
                    );

                    await interaction.reply(`Group ${name} has been renamed to ${newName}.`);
                } else {
                    await interaction.reply("You are not the owner of this group or the group does not exist.");
                }
                break;
            }
            case "private": {
                var name = interaction.options.getString('name');
                var isPrivate = interaction.options.get('private');

                const group = await client.database.db("kiwi").collection("groups").findOne({
                    name: name,
                    guildId: interaction.guild.id,
                    ownerId: interaction.member.id
                });

                if (group && group.admins.includes(interaction.member.id)) {
                    await client.database.db("kiwi").collection("groups").updateOne(
                        { name: name, guildId: interaction.guild.id },
                        { $set: { private: isPrivate } }
                    );
                    await interaction.reply(`Group ${name} privacy has been updated.`);
                } else {
                    await interaction.reply("You are not the owner of this group.");
                }
                break;
            }
            case "owner": {
                var user = interaction.options.getUser('user');

                if (user.bot) {
                    await interaction.reply("Bots cannot have ownership of a group.");
                    return;
                }

                var name = interaction.options.getString('name');

                const group = await client.database.db("kiwi").collection("groups").findOne({
                    name: name,
                    guildId: interaction.guild.id,
                    ownerId: interaction.member.id
                });

                if (group && group.admins.includes(interaction.member.id)) {
                    await client.database.db("kiwi").collection("groups").updateOne(
                        { name: name, guildId: interaction.guild.id },
                        { $set: { ownerId: user.id }, $addToSet: { admins: user.id } }
                    );

                    await interaction.reply(`Ownership of group ${name} has been transferred to ${user.username}.`);
                } else {
                    await interaction.reply("You are not the owner of this group.");
                }
                break;
            }
            case "list": {
                const groups = await client.database.db("kiwi").collection("groups").find({
                    guildId: interaction.guild.id
                }).toArray();

                if (groups.length > 0) {
                    const groupNames = groups.map(group => group.name).join(", ");
                    await interaction.reply(`Groups in this guild: ${groupNames}`);
                } else {
                    await interaction.reply("There are no groups in this guild.");
                }
                break;
            }
            case "info": {
                var name = interaction.options.getString('name');
                const group = await client.database.db("kiwi").collection("groups").findOne({
                    name: name,
                    guildId: interaction.guild.id
                });

                if (group) {
                    var em = new EmbedBuilder()
                        .setTitle("Group " + group.name)
                        .addFields(
                            { name: "Owner", value: `<@${group.ownerId}>` },
                            { name: "Admins", value: group.admins.map(admin => `<@${admin}>`).join(", ") },
                            { name: "Members", value: group.members.map(member => `<@${member}>`).join(", ") },
                            { name: "Private", value: group.private ? "Yes" : "No" }
                        )
                        .setColor(0x2b2d31)
                        .setTimestamp();

                    await interaction.reply({ embeds: [em] });
                } else {
                    await interaction.reply("Group does not exist.");
                }
                break;
            }
            case "delete": {
                var name = interaction.options.getString('name');
                const group = await client.database.db("kiwi").collection("groups").findOne({
                    name: name,
                    guildId: interaction.guild.id,
                    ownerId: interaction.member.user.id
                });

                if (group && group.ownerId === interaction.member.id) {
                    await client.database.db("kiwi").collection("groups").deleteOne({
                        name: name,
                        guildId: interaction.guild.id,
                        ownerId: interaction.member.id
                    });

                    const role = interaction.guild.roles.cache.get(group.roleId);
                    if (role) {
                        await role.delete();
                    }

                    await interaction.reply(`Group ${name} has been deleted.`);
                } else {
                    await interaction.reply("You are not the owner of this group.");
                }
                break;
            }*/
        }
	},
}