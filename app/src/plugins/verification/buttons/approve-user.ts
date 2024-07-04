import { KiwiClient } from "../../../client";

import { 
    ButtonStyle,
    ComponentType,
    ButtonInteraction,
    EmbedBuilder,
    TextChannel
} from "discord.js";

import { Button } from "../../../types/component";
import { Events } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildGroupEntity } from "../../../entities/GuildGroup";
import { GroupMemberEntity } from "../../../entities/GroupMember";
import { UserVerifiedEntity } from "../../../entities/UserVerified";
import { PendingMessageEntity } from "../../../entities/PendingMessage";
import { GuildUserEntity } from "../../../entities/GuildUser";

/**
 * @type {Button}
 */
export const ApproveUser: Button = {
    config: {
        type: ComponentType.Button,
        custom_id: "approve-guest",
        style: ButtonStyle.Success,
        label: "Approve"
    },
    
    /**
    * @param {ButtonInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction: ButtonInteraction, client: KiwiClient) {
        await interaction.deferReply({ ephemeral: true });
        var userId = interaction.customId.split("_")[1];

        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        const GuildGroupRepository = await dataSource.getRepository(GuildGroupEntity);
        const GroupMemberRepository = await dataSource.getRepository(GroupMemberEntity);
        const UserVerifiedRepository = await dataSource.getRepository(UserVerifiedEntity);
        const PendingMessageRepository = await dataSource.getRepository(PendingMessageEntity);
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        
        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: interaction.guild.id } });

        var roles = new Array();

        if (!guildConfig.levelOne) {
            interaction.followUp({ content: "Level One role is not set in config", ephemeral: true })
            return;
        }
            
        roles.push(guildConfig.levelOne);
        
        var groups = await GroupMemberRepository.find({ where: { userId: userId }});
        for (let group of groups) {
            let groupData = await GuildGroupRepository.findOne({ where: { groupId: group.groupId }});
            if (groupData) roles.push(groupData.roleId);
        }

        var message = await interaction.channel.messages.fetch(interaction.message.id);
        if (message) {
            await message.delete();
        }
        PendingMessageRepository.delete({ guildId: interaction.guild.id, userId: userId });

        var member = await interaction.guild.members.fetch(userId).catch(() => {});
        if (!member) {
            interaction.followUp({ content: "Cant find the user in the server", ephemeral: true });
            return;
        }

        GuildUserRepository.insert({
            guildId: interaction.guild.id,
            userId: userId,
            userName: member.user.username,
            level: 1
        });

        UserVerifiedRepository.insert({
            guildId: interaction.guild.id,
            userId: userId,
            userName: member.user.username,
            modId: interaction.user.id,
            modName: interaction.user.username
        });

        await member.roles.add(roles).catch(() => {});

        var ApprovedEmbed = new EmbedBuilder()
            .setTitle("You've Been Approved")
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                { name: "Server ID", value: interaction.guild.id },
                { name: "Server Name", value: interaction.guild.name },
                { name: "Can't find it", value: `[Click Here](https://discord.com/channels/${interaction.guild.id})` }
            )
            .setFooter({ text: "Enjoy your stay!" })
            .setColor(0x90EE90);
        
        await member.send({ embeds: [ApprovedEmbed] }).catch(() => {});

        interaction.followUp({ content: `**${member.user.username}** has been approved!`, ephemeral: true});

        if (guildConfig.logChannel) {
            var log = await interaction.guild.channels.fetch(guildConfig.logChannel) as TextChannel;
            if (!log) return;

            var LogEmbed = new EmbedBuilder()
                .setTitle("Approved User")
                .setThumbnail(member.user.avatarURL())
                .setColor(0x90EE90)
                .addFields(
                    { name: "User", value: `<@${member.user.id}>\n${client.capitalize(member.user.username)}` },
                    { name: "Approved By", value: `<@${interaction.user.id}>\n${client.capitalize(interaction.user.username)}` }
                )

            await log.send({
                embeds: [LogEmbed]
            });
        }
    }
}