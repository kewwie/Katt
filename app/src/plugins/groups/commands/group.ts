import {
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    EmbedBuilder,
    resolveColor,
    ColorResolvable,
    ActionRowBuilder,
    ButtonBuilder
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
import { GroupMember } from "../../../data/entities/GroupMember";
import { GroupInvite } from "../../../data/entities/GroupInvite";

import { AcceptInvite } from "../buttons/accept-invite";
import { DenyInvite } from "../buttons/deny-invite";

/**
 * @type {Command}
 */
export const GroupCommand: Command =  {
	config: {
        name: "group",
        description: "Group Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: null,
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
                name: "join",
                description: "Join a group",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "name",
                        description: "Name of the group",
                        autocomplete: true,
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
                        autocomplete: true,
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "invite",
                description: "Invite a user to a group",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "name",
                        description: "Name of the group",
                        autocomplete: true,
                        required: true
                    },
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user to invite to the group",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "kick",
                description: "Kick a user from a group",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "name",
                        description: "Name of the group",
                        autocomplete: true,
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
                                autocomplete: true,
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
                                autocomplete: true,
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
                                autocomplete: true,
                                required: true
                            },
                            {
                                type: OptionTypes.STRING,
                                name: "private",
                                description: "true or false",
                                choices: [
                                    { name: "True", value: "true" },
                                    { name: "False", value: "false" }
                                ],
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
                                autocomplete: true,
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
                        autocomplete: true,
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
                        autocomplete: true,
                        required: true
                    }
                ]
            }
        ]
    },

    /**
     * @param {AutocompleteInteraction} interaction
     * @param {KiwiClient} client
     */
    async autocomplete(interaction: AutocompleteInteraction, client: KiwiClient) {
        const GroupRepository = await dataSource.getRepository(Group);
        const focusedValue = interaction.options.getFocused();
        const choices = await GroupRepository.find({ where: { guildId: interaction.guild.id } });
		const filtered = choices.filter(choice => choice.name.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice.name, value: choice.name })),
		);
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient) {
        const GroupRepository = await dataSource.getRepository(Group);
        const GroupMembersRepository = await dataSource.getRepository(GroupMember);
        const GroupInvitesRepository = await dataSource.getRepository(GroupInvite);
        
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

                var ResGroup = await GroupRepository.insert({
                    groupId: String(Date.now() - 1000),
                    name: name,
                    guildId: interaction.guild.id,
                    roleId: role.id,
                    ownerId: interaction.user.id,
                    private: false
                });

                await GroupMembersRepository.insert({
                    groupId: ResGroup.identifiers[0].groupId,
                    userId: interaction.user.id,
                    username: interaction.user.username
                });

                await interaction.reply(`Group ${name} has been created.`);
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
                    if (existingGroup.private) {
                        await interaction.reply("This group is private.");
                        return;
                    }

                    const groupMember = await GroupMembersRepository.findOne({
                        where: { groupId: existingGroup.groupId, userId: interaction.user.id }
                    });

                    if (groupMember) {
                        await interaction.reply("You are already a member of this group.");
                        return;
                    }
                    await interaction.guild.members.cache.get(interaction.user.id).roles.add(existingGroup.roleId);

                    await GroupMembersRepository.insert({
                        groupId: existingGroup.groupId,
                        userId: interaction.user.id,
                        username: interaction.user.username
                    });
                    await interaction.reply(`You have joined the group **${name}**.`);
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
                    if (existingGroup.ownerId === interaction.user.id) {
                        await interaction.reply("You cannot leave a group you own.");
                        return;
                    }

                    const groupMember = await GroupMembersRepository.findOne({ 
                        where: { groupId: existingGroup.groupId, userId: interaction.user.id }
                    });

                    if (groupMember) {
                        await interaction.guild.members.cache.get(interaction.user.id).roles.remove(existingGroup.roleId);
                        
                        await GroupMembersRepository.delete({ groupId: existingGroup.groupId, userId: interaction.user.id })
                        await interaction.reply(`You have left the group **${name}**`);
                    } else {
                        await interaction.reply(`You are not a member of the group **${name}**`);
                    }
                } else {
                    await interaction.reply(`The group **${name}** does not exist`);
                }
                break;
            }

            case "invite": {
                var name = interaction.options.getString('name');
                var user = interaction.options.getUser('user');

                const existingGroup = await GroupRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        name: name
                    }
                });

                if (user.bot) {
                    await interaction.reply("Bots cannot be added to groups");
                    return;
                }

                if (existingGroup) {
                    var group = await GroupRepository.findOne({ where: { groupId: existingGroup.groupId }});
                    var groupMembers = await GroupMembersRepository.find({ where: { groupId: existingGroup.groupId }});

                    if (groupMembers.find(member => member.userId === interaction.user.id)) {
                        await interaction.reply(`You do not have permission to invite members to group **${name}**`);
                        return;
                    }
                
                    if (groupMembers.find(member => member.userId === user.id)) {
                        let userTag = await client.getTag({username: user.username, discriminator: user.discriminator});
                        await interaction.reply(`**${userTag}** is already a member of group **${name}**`);
                        return;
                    }

                    var rows = new Array();

                    rows.push(new ActionRowBuilder()
                        .addComponents([
                            new ButtonBuilder(AcceptInvite.config)
                                .setCustomId("accept-invite_" + user.id),
                            new ButtonBuilder(DenyInvite.config)
                                .setCustomId("deny-invite_" + user.id)
                    ]));

                    var message = await user.send({
                        content: `You have been invited to group **${name}** by **${interaction.user.username}**. Do you accept?`,
                        components: rows
                    }).catch(() => {
                        interaction.reply("I was unable to send a DM to the user");
                    });

                    if (!message) return;

                    await GroupInvitesRepository.insert({
                        group_id: existingGroup.groupId,
                        user_id: user.id,
                        inviter_id: interaction.user.id,
                        message_id: message.id
                    });
                    let userTag = await client.getTag({username: user.username, discriminator: user.discriminator});
                    await interaction.reply(`**${userTag}** has been invited to group **${name}**`);
        
                } else {
                    await interaction.reply(`Group **${name}** does not exist`);
                }
                break;
            }

            case "kick": {
                var name = interaction.options.getString('name');
                var user = interaction.options.getUser('user');

                const existingGroup = await GroupRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        name: name
                    }
                });

                if (existingGroup) {
                    if (existingGroup.ownerId === user.id) {
                        await interaction.reply("You cannot remove the owner of the group");
                        return;
                    }

                    if (existingGroup.ownerId !== interaction.user.id) {
                        await interaction.reply(`You do not have permission to remove members from group **${name}**`);
                        return;
                    }

                    var userTag = await client.getTag({username: user.username, discriminator: user.discriminator});
                    const groupMember = await GroupMembersRepository.findOne({ where: { groupId: existingGroup.groupId, userId: user.id }});
                    if (groupMember) {
                        await interaction.guild.members.cache.get(user.id).roles.remove(existingGroup.roleId);
                        await GroupMembersRepository.delete({ groupId: existingGroup.groupId, userId: user.id })
                        await interaction.reply(`**${userTag}** has been removed from group **${name}**`);
                    } else {
                        await interaction.reply(`**${userTag}** is not a member of group **${name}**`);
                    }
                } else {
                    await interaction.reply(`Group **${name}** does not exist`);
                }
                break;
            }

            case "color": {
                var name = interaction.options.getString('name');
                var color = interaction.options.getString('color');

                const existingGroup = await GroupRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        name: name
                    }
                });

                if (existingGroup) {
                    var group = await GroupRepository.findOne({ where: { groupId: existingGroup.groupId }});
                    if (group.ownerId !== interaction.user.id) {
                        await interaction.reply(`You do not have permission to change the color of the group **${name}**`);
                        return;
                    }
                    const role = interaction.guild.roles.cache.get(existingGroup.roleId);
                    if (role) {
                        await role.setColor(resolveColor(color as ColorResolvable));
                        await interaction.reply(`Color of group **${name}** has been changed to **${color}**`);
                    } else {
                        await interaction.reply("Group role not found");
                    }
                } else {
                    await interaction.reply("You are not the owner of this group");
                }
                break;
            }

            case "name": {
                var name = interaction.options.getString('name');
                var newName = interaction.options.getString('newname');

                const existingGroup = await GroupRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        name: name
                    }
                });

                if (existingGroup) {
                    var group = await GroupRepository.findOne({ where: { groupId: existingGroup.groupId }});
                    if (group.ownerId !== interaction.user.id) {
                        await interaction.reply(`You do not have permission to change the name of the group **${name}**`);
                        return;
                    }
                    const role = interaction.guild.roles.cache.get(existingGroup.roleId);
                    if (role) {
                        await role.edit({ name: `Group ${newName}` });
                    } else {
                        await interaction.reply("Group role not found");
                        return;
                    }

                    await GroupRepository.update(
                        { groupId: existingGroup.groupId },
                        { name: newName }
                    );

                    await interaction.reply(`Group **${name}** has been renamed to **${newName}**`);
                } else {
                    await interaction.reply("This group doesnt exist");
                }
                break;
            }

            case "private": {
                var name = interaction.options.getString('name');
                var isPrivate = interaction.options.getString('private');

                const existingGroup = await GroupRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        name: name
                    }
                });

                if (existingGroup) {
                    var group = await GroupRepository.findOne({ where: { groupId: existingGroup.groupId }});
                    if (group.ownerId !== interaction.user.id) {
                        await interaction.reply(`You do not have permission to change the privacy of the group **${name}**`);
                        return;
                    }

                    await GroupRepository.update({ groupId: existingGroup.groupId }, { private: (isPrivate === "true") });
                    await interaction.reply(`Group **${name}** privacy has been updated`);
                } else {
                    await interaction.reply("This group doesnt exist");
                }
                break;
            }

            case "owner": {
                var user = interaction.options.getUser('user');
                var name = interaction.options.getString('name');

                if (user.bot) {
                    await interaction.reply("Bots cannot have ownership of a group");
                    return;
                }

                const existingGroup = await GroupRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        name: name
                    }
                });

                if (existingGroup) {
                    if (existingGroup.ownerId !== interaction.user.id) {
                        await interaction.reply("You are not the owner of this group");
                        return;
                    }
                    
                    await GroupRepository.update({ groupId: existingGroup.groupId }, { ownerId: user.id });
                    await GroupMembersRepository.upsert(
                        { groupId: existingGroup.groupId, userId: user.id, username: user.username },
                        ["groupId", "userId"]
                    );

                    await interaction.reply(`Ownership of group **${name}** has been transferred to **${user.username}**`);
                } else {
                    await interaction.reply("This group doesnt exist");
                }
                break;
            }

            case "delete": {
                var name = interaction.options.getString('name');

                const existingGroup = await GroupRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        name: name
                    }
                });

                if (existingGroup) {
                    if (existingGroup.ownerId !== interaction.user.id) {
                        await interaction.reply("You are not the owner of this group");
                        return;
                    }

                    const role = interaction.guild.roles.cache.get(existingGroup.roleId);
                    if (role) {
                        await role.delete();
                    }

                    await GroupRepository.delete({ guildId: interaction.guild.id, groupId: existingGroup.groupId });
                    await GroupMembersRepository.delete({ groupId: existingGroup.groupId });

                    await interaction.reply(`Group **${name}** has been deleted`);
                } else {
                    await interaction.reply("This group doesnt exist");
                }
                break;
            }

            case "list": {
                const groups = await GroupRepository.find({ where: { guildId: interaction.guild.id } });
                if (groups.length > 0) {
                    await interaction.reply(`# Groups \n**${groups.map(group => group.name).join("\n")}**`);
                } else {
                    await interaction.reply("There are no groups in this guild");
                }
                break;
            }

            case "info": {
                var name = interaction.options.getString('name');

                const existingGroup = await GroupRepository.findOne({
                    where: {
                        guildId: interaction.guild.id,
                        name: name
                    }
                });

                if (existingGroup) {
                    const groupMembers = await GroupMembersRepository.find({ where: { groupId: existingGroup.groupId } });

                    var em = new EmbedBuilder()
                        .setTitle("Group " + existingGroup.name)
                        .addFields(
                            { name: "Owner", value: `<@${existingGroup.ownerId}>` },
                            { name: "Members", value: groupMembers.map(member => `${member.username}`).join(", ") },
                            { name: "Private", value: existingGroup.private ? "Yes" : "No" }
                        )
                        .setColor(client.embed.color)
                        .setTimestamp();

                    await interaction.reply({ embeds: [em] });
                } else {
                    await interaction.reply("Group does not exist");
                }
                break;
            }
        }
	},
}