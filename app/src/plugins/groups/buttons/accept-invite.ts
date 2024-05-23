import { KiwiClient } from "../../../client";

import { 
    ButtonStyle,
    ComponentType,
    ButtonInteraction
} from "discord.js";

import { Button } from "../../../types/component";

import { dataSource } from "../../../data/datasource";
import { Group } from "../../../data/entities/Group";
import { GroupMember } from "../../../data/entities/GroupMember";
import { GroupInvite } from "../../../data/entities/GroupInvite";

/**
 * @type {Button}
 */
export const AcceptInvite: Button = {
    config: {
        type: ComponentType.Button,
        custom_id: "accept-invite",
        style: ButtonStyle.Success,
        label: "Accept"
    },
    dms: true,
    
    /**
    * @param {ButtonInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction: ButtonInteraction, client: KiwiClient) {
        const GroupRepository = await dataSource.getRepository(Group);
        const GroupMembersRepository = await dataSource.getRepository(GroupMember);
        const GroupInvitesRepository = await dataSource.getRepository(GroupInvite);

        var groupInvite = await GroupInvitesRepository.findOne({ where: { user_id: interaction.user.id, message_id: interaction.message.id }});
        var groupMember = await GroupMembersRepository.findOne({ where: { userId: interaction.user.id, groupId: groupInvite.group_id }});
        var group = await GroupRepository.findOne({ where: { groupId: groupInvite.group_id }});

        if (!group) {
            await interaction.message.delete();
            await interaction.channel.send({ content: "Group not found"});
            return;
        }
        
        if (groupMember) {
            await interaction.message.delete();
            await interaction.channel.send(`You are already a member of group **${group.name}**`);
            return;
        }

        await GroupMembersRepository.insert({ 
            userId: interaction.user.id,
            groupId: groupInvite.group_id,
            username: interaction.user.username,
        });

        await interaction.channel.send(`You have joined group **${group.name}**`);

        await GroupInvitesRepository.delete({ user_id: interaction.user.id, message_id: interaction.message.id });
        var message = await interaction.channel.messages.fetch(interaction.message.id);
        if (message) {
            await message.delete();
        }

        var guild = await client.guilds.fetch(group.guildId);
        var member = await guild.members.fetch(interaction.user.id)
        if (member) {
            var role = member.roles.cache.find(role => role.id === group.roleId);
            if (!role) {
                await member.roles.add(group.roleId).catch(() => {});
            }
        }
    }
}