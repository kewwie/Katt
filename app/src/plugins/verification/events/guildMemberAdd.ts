import {
    GuildMember,
    EmbedBuilder,
    TextChannel,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildUserEntity } from "../../../entities/GuildUser";
import { GuildBlacklistEntity } from "../../../entities/GuildBlacklist";
import { GuildGroupEntity } from "../../../entities/GuildGroup";
import { GroupMemberEntity } from "../../../entities/GroupMember";
import { PendingMessageEntity } from "../../../entities/PendingMessage";

import { ApproveUser } from "../buttons/approve-user";
import { DenyUser } from "../buttons/deny-user";

import { GetHighestRole } from "../../roles/functions/getHighestRole";

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
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        const BlacklistRepository = await dataSource.getRepository(GuildBlacklistEntity);
        const GuildGroupRepository = await dataSource.getRepository(GuildGroupEntity);
        const GroupMemberRepository = await dataSource.getRepository(GroupMemberEntity);
        const PendingMessageRepository = await dataSource.getRepository(PendingMessageEntity);

        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: member.guild.id } });
        var user = await GuildUserRepository.findOne({ where: { guildId: member.guild.id, userId: member.id  } });
        var isStaff = user?.level >= 3;
        var isBlacklisted = await BlacklistRepository.findOne({ where: { guildId: member.guild.id, userId: member.id } });

        if (isStaff && guildConfig) {
            var roles = {
                1: guildConfig.levelOne,
                2: guildConfig.levelTwo,
                3: guildConfig.levelThree,
                4: guildConfig.levelFour,
                5: guildConfig.levelFive
            };
            
            var roleId = await GetHighestRole(user.level, roles);
            if (roleId) {
                member.roles.add(roleId).catch(() => {});

                for (var groupMembers of await GroupMemberRepository.find({ where: { userId: member.id } })) {
                    var group = await GuildGroupRepository.findOne({ where: { groupId: groupMembers.groupId } });
                    if (group) {
                        member.roles.add(group.roleId).catch(() => {});
                    }
                }

                var rows = new Array();
                rows.push(new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setLabel(member.guild.name)
                            .setURL("https://discord.com/channels/" + member.guild.id)
                    ]));

                var AutoApprovedEmbed = new EmbedBuilder()
                    .setTitle("You've Been Approved")
                    .setThumbnail(member.guild.iconURL())
                    .addFields(
                        { name: "Server ID", value: member.guild.id },
                        { name: "Server Name", value: member.guild.name },
                        { name: "Level", value: `${user.level}` },
                        { name: "Auto", value: "True" }
                    )
                    .setFooter({ text: "Enjoy your stay!" })
                    .setColor(0x90EE90);

                await member.send({ embeds: [AutoApprovedEmbed], components: rows }).catch(() => {});

                if (guildConfig.logChannel) {
                    var log = await member.guild.channels.fetch(guildConfig.logChannel) as TextChannel;
                    if (!log) return;
        
                    var em = new EmbedBuilder()
                        .setTitle("User Approved")
                        .setThumbnail(member.user.avatarURL())
                        .setColor(0x90EE90)
                        .addFields(
                            { name: "User", value: `<@${member.user.id}>\n${member.user.username}` },
                            { name: "Level", value: `${user.level}` },
                            { name: "Auto", value: "True" }
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

            if (guildConfig && guildConfig.logChannel) {
                var log = await member.guild.channels.fetch(guildConfig.logChannel) as TextChannel;
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
            if (guildConfig && guildConfig.pendingChannel) {
                var pendingChannel = await member.guild.channels.fetch(guildConfig.pendingChannel) as TextChannel;
                if (!pendingChannel) return;

                let pendingMessage = await PendingMessageRepository.findOne({ where: { guildId: member.guild.id, userId: member.id } });
                if (pendingMessage) {
                    let existingMessage = await pendingChannel.messages.fetch(pendingMessage.messageId).catch(() => {});
                    if (!existingMessage) {
                        await PendingMessageRepository.delete({ _id: pendingMessage._id });
                    } else {
                        return;
                    }
                }
    
                var em = new EmbedBuilder()
                    .setTitle("Pending Verification")
                    .setThumbnail(member.user.avatarURL())
                    .setColor(0xADD8E6)
                    .addFields(
                        { name: "ID", value: `${member.user.id}` },
                        { name: "User", value: `<@${member.user.id}>` },
                        { name: "Username", value: `${client.capitalize(member.user.username)}` }
                    )
                
                var rows = new Array();

                rows.push(new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder(ApproveUser.config)
                            .setCustomId("approve-guest_" + member.id),
                        new ButtonBuilder(DenyUser.config)
                            .setCustomId("deny-user_" + member.id)
                    ])
                );
                
                var msg = await pendingChannel.send({
                    content: guildConfig.verificationPing ? `<@&${guildConfig.verificationPing}>` : "@everyone",
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