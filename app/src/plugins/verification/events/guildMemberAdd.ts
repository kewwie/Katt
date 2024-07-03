import {
    GuildMember,
    EmbedBuilder,
    TextChannel,
    ActionRowBuilder,
    ButtonBuilder,
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildAdminEntity } from "../../../entities/GuildAdmin";
import { GuildBlacklistEntity } from "../../../entities/GuildBlacklist";
import { GuildGroupEntity } from "../../../entities/GuildGroup";
import { GroupMemberEntity } from "../../../entities/GroupMember";
import { PendingMessageEntity } from "../../../entities/PendingMessage";

import { ApproveGuest } from "../buttons/approve-guest";
import { DenyUser } from "../buttons/deny-user";

/**
 * @type {Event}
 */
export const GuildMemberAdd: Event = {
    name: Events.GuildMemberAdd,

    /**
     * @param {GuildMember} member
     */
    async getGuildId(member: GuildMember) {
        return member.guild.id;
    },

    /**
    * @param {Client} client
    * @param {GuildMember} member
    */
    async execute(client: KiwiClient, member: GuildMember) {
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        const GuildAdminRepository = await dataSource.getRepository(GuildAdminEntity);
        const BlacklistRepository = await dataSource.getRepository(GuildBlacklistEntity);
        const GuildGroupRepository = await dataSource.getRepository(GuildGroupEntity);
        const GroupMemberRepository = await dataSource.getRepository(GroupMemberEntity);
        const PendingMessageRepository = await dataSource.getRepository(PendingMessageEntity);

        var g = await GuildConfigRepository.findOne({ where: { guildId: member.guild.id } });
        var isAdmin = await GuildAdminRepository.findOne({ where: { guildId: member.guild.id, userId: member.id } });
        var isBlacklisted = await BlacklistRepository.findOne({ where: { guildId: member.guild.id, userId: member.id } });

        if (isAdmin && g && g.adminRole) {
            var adminRole = await member.guild.roles.fetch(g.adminRole);
            if (adminRole) {
                member.roles.add(adminRole.id).catch(() => {});

                for (var groupMembers of await GroupMemberRepository.find({ where: { userId: member.id } })) {
                    var group = await GuildGroupRepository.findOne({ where: { groupId: groupMembers.groupId } });
                    if (group) {
                        member.roles.add(group.roleId).catch(() => {});
                    }
                }

                var AutoApprovedEmbed = new EmbedBuilder()
                    .setTitle("You've Been Approved")
                    .setThumbnail(member.guild.iconURL())
                    .addFields(
                        { name: "Server ID", value: member.guild.id },
                        { name: "Server Name", value: member.guild.name },
                        { name: "Type", value: "Admin" },
                        { name: "Auto", value: "True" }
                    )
                    .setFooter({ text: "Enjoy your stay!" })
                    .setColor(0x90EE90);

                await member.send({ embeds: [AutoApprovedEmbed] }).catch(() => {});

                if (g.logChannel) {
                    var log = await member.guild.channels.fetch(g.logChannel) as TextChannel;
                    if (!log) return;
        
                    var em = new EmbedBuilder()
                        .setTitle("Auto Approved Admin")
                        .setThumbnail(member.user.avatarURL())
                        .setColor(0x90EE90)
                        .addFields(
                            { name: "User", value: `<@${member.user.id}>\n${member.user.username}` },
                            { name: "Type", value: "Admin" }
                        )
        
                    await log.send({
                        embeds: [em]
                    });
                }
            }
        } else if (isBlacklisted) {
            var BlacklistedEmbed = new EmbedBuilder()
                .setTitle("You are Blacklisted")
                .setThumbnail(member.guild.iconURL())
                .addFields(
                    { name: "Server ID", value: member.guild.id },
                    { name: "Server Name", value: member.guild.name }
                )
                .setFooter({ text: "Stop being so bad!" })
                .setColor(0xFF474D);

            await member.send({ embeds: [BlacklistedEmbed] }).catch(() => {});

            member.kick("Blacklisted").catch(() => {});

            if (g && g.logChannel) {
                var log = await member.guild.channels.fetch(g.logChannel) as TextChannel;
                if (!log) return;
    
                var em = new EmbedBuilder()
                    .setTitle("Blacklisted User Joined")
                    .setThumbnail(member.user.avatarURL())
                    .setColor(0xFF474D)
                    .addFields(
                        { name: "ID", value: `${member.user.id}` },
                        { name: "User", value: `<@${member.user.id}>` },
                        { name: "Username", value: `${member.user.username}` },
                        { name: "By", value: `<@${isBlacklisted.modId}>\n${isBlacklisted.modName}` }
                    )
    
                await log.send({
                    embeds: [em]
                }).catch(() => {});
            }
    
        } else {
            if (g && g.pendingChannel) {
                var existingMessage = await PendingMessageRepository.findOne({ where: { guildId: member.guild.id, userId: member.id } });
                if (existingMessage) return;

                var pending = await member.guild.channels.fetch(g.pendingChannel) as TextChannel;
                if (!pending) return;
    
                var em = new EmbedBuilder()
                    .setTitle("Pending Verification")
                    .setThumbnail(member.user.avatarURL())
                    .setColor(0xADD8E6)
                    .addFields(
                        { name: "ID", value: `${member.user.id}` },
                        { name: "User", value: `<@${member.user.id}>` },
                        { name: "Username", value: `${member.user.username}` }
                    )
                
                var rows = new Array();

                rows.push(new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder(ApproveGuest.config)
                            .setCustomId("approve-guest_" + member.id),
                        new ButtonBuilder(DenyUser.config)
                            .setCustomId("deny-user_" + member.id)
                    ])
                );
                
                var msg = await pending.send({
                    content: g.verificationPing ? `<@&${g.verificationPing}>` : "@everyone",
                    embeds: [em],
                    components: rows
                });

                PendingMessageRepository.insert({
                    guildId: member.guild.id,
                    userId: member.id,
                    messageId: msg.id
                });
            }     
        }  
    }
}