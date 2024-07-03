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
        const PendingMessageRepository = await dataSource.getRepository(PendingMessageEntity);
        
        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: interaction.guild.id } });

        var roles = new Array();

        if (!guildConfig.levelOne) {
            interaction.followUp({ content: "Level One role is not set in config", ephemeral: true })
            return;
        }
            
        roles.push(guildConfig.levelOne);

        for (const g of await GroupMemberRepository.find({ where: { userId } })) {
            const group = await GuildGroupRepository.findOne({ where: { groupId: g.groupId } });
            if (group) {
                roles.push(group.roleId);
            }
        }

        var message = await interaction.channel.messages.fetch(interaction.message.id);
        if (message) {
            await message.delete();
        }
        PendingMessageRepository.delete({ guildId: interaction.guild.id, userId: userId });

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

        if (guildConfig.logChannel) {
            var log = await interaction.guild.channels.fetch(guildConfig.logChannel) as TextChannel;
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