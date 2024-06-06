import { KiwiClient } from "../../../client";

import { 
    ButtonStyle,
    ComponentType,
    ButtonInteraction
} from "discord.js";

import { Button } from "../../../types/component";

import { dataSource } from "../../../datasource";
import { GuildGroupEntity } from "../../../entities/GuildGroup";
import { GroupMemberEntity } from "../../../entities/GroupMember";
import { GroupInviteEntity } from "../../../entities/GroupInvite";

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
        const GuildGroupRepository = await dataSource.getRepository(GuildGroupEntity);
        const GroupMemberRepository = await dataSource.getRepository(GroupMemberEntity);
        const GroupInviteRepository = await dataSource.getRepository(GroupInviteEntity);

        var groupInvite = await GroupInviteRepository.findOne({ where: { userId: interaction.user.id, messageId: interaction.message.id }});
        var groupMember = await GroupMemberRepository.findOne({ where: { userId: interaction.user.id, groupId: groupInvite.groupId }});
        var group = await GuildGroupRepository.findOne({ where: { groupId: groupInvite.groupId }});

        if (!group) {
            await interaction.message.delete();
            await interaction.channel.send({ content: "Group not found"});
            return;
        }
        
        if (groupMember) {
            await interaction.message.delete();
            await interaction.channel.send(`You are already a member of group **${group.groupName}**`);
            return;
        }

        await GroupMemberRepository.insert({ 
            userId: interaction.user.id,
            groupId: groupInvite.groupId,
            userName: interaction.user.username,
        });

        await interaction.channel.send(`You have joined group **${group.groupName}**`);

        await GroupInviteRepository.delete({ userId: interaction.user.id, messageId: interaction.message.id });
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