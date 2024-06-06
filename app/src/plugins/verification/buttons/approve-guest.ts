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
import { PendingMessageEntity } from "../../../entities/PendingMessage";

/**
 * @type {Button}
 */
export const ApproveGuest: Button = {
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
        const PendingMessageRepository = await dataSource.getRepository(PendingMessageEntity);
        
        var guild = await GuildRepository.findOne({ where: { guildId: interaction.guild.id } });

        var roles = new Array();

        if (!guild.guestRole) {
            interaction.followUp({ content: "Guest role is not set in the dashboard", ephemeral: true })
            return;
        }
            
        roles.push(guild.guestRole);

        for (const g of await GroupMembersRepository.find({ where: { userId } })) {
            const group = await GroupRepository.findOne({ where: { groupId: g.groupId } });
            if (group) {
                roles.push(group.roleId);
            }
        }

        var message = await interaction.channel.messages.fetch(interaction.message.id);
        if (message) {
            await message.delete();
        }
        PendingMessagesRepository.delete({ guildId: interaction.guild.id, userId: userId });

        var member = await interaction.guild.members.fetch(userId).catch(() => {});
        if (member) {
            await member.roles.add(roles).catch(() => {});
        } else {
            interaction.followUp({ content: "Cant find the user in the server", ephemeral: true });
            return;
        }

        client.emit(Events.GuildVerifiedAdd, interaction.guild, member, "guest");

        var ApprovedEmbed = new EmbedBuilder()
            .setTitle("You've Been Approved")
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                { name: "Server ID", value: interaction.guild.id },
                { name: "Server Name", value: interaction.guild.name },
                { name: "Type", value: "Guest" }
            )
            .setFooter({ text: "Enjoy your stay!" })
            .setColor(0x90EE90);
        
        await member.send({ embeds: [ApprovedEmbed] }).catch(() => {});

        interaction.followUp({ content: `**${member.user.username}** has been approved as a guest`, ephemeral: true});

        if (guild.logChannel) {
            var log = await interaction.guild.channels.fetch(guild.logChannel) as TextChannel;
            if (!log) return;

            var em = new EmbedBuilder()
                .setTitle("Approved Guest")
                .setThumbnail(member.user.avatarURL())
                .setColor(0x90EE90)
                .addFields(
                    { name: "User", value: `<@${member.user.id}>\n${member.user.username}` },
                    { name: "Approved By", value: `<@${interaction.member.user.id}>\n${interaction.member.user.username}` },
                    { name: "Type", value: "Guest" },
                )

            await log.send({
                embeds: [em]
            });
        }
    }
}