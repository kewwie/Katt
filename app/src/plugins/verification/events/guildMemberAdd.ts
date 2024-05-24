import {
    GuildMember,
    EmbedBuilder,
    TextChannel,
    ActionRowBuilder,
    ButtonBuilder,
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { GuildConfig } from "../../../data/entities/GuildConfig";
import { GuildAdmins } from "../../../data/entities/GuildAdmins";

import { ApproveGuest } from "../buttons/approve-guest";
import { DenyUser } from "../buttons/deny-user";
import { Group } from "../../../data/entities/Group";
import { GroupMember } from "../../../data/entities/GroupMember";
import { PendingMessage } from "../../../data/entities/PendingMessage";

/**
 * @type {Event}
 */
export const GuildMemberAdd: Event = {
    name: Events.GuildMemberAdd,

    /**
    * @param {Client} client
    * @param {GuildMember} member
    */
    async execute(client: KiwiClient, member: GuildMember) {
        const GuildConfigRepository = await dataSource.getRepository(GuildConfig);
        const GuildAdminsRepository = await dataSource.getRepository(GuildAdmins);
        const GroupsRepository = await dataSource.getRepository(Group);
        const GroupMembersRepository = await dataSource.getRepository(GroupMember);
        const PendingMessagesRepository = await dataSource.getRepository(PendingMessage);

        var g = await GuildConfigRepository.findOne({ where: { guildId: member.guild.id } });
        var isAdmin = await GuildAdminsRepository.findOne({ where: { guildId: member.guild.id, userId: member.id } });

        if (isAdmin && g && g.adminRole) {
            var adminRole = await member.guild.roles.fetch(g.adminRole);
            if (adminRole) {
                member.roles.add(adminRole.id).catch(() => {});

                for (var groupMembers of await GroupMembersRepository.find({ where: { userId: member.id } })) {
                    var group = await GroupsRepository.findOne({ where: { groupId: groupMembers.groupId } });
                    if (group) {
                        member.roles.add(group.roleId).catch(() => {});
                    }
                }

                if (g.logsChannel) {
                    var log = await member.guild.channels.fetch(g.logsChannel) as TextChannel;
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
        } else {
            if (g && g.pendingChannel) {
                var existingMessage = await PendingMessagesRepository.findOne({ where: { guild_id: member.guild.id, user_id: member.id } });
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

                PendingMessagesRepository.insert({
                    guild_id: member.guild.id,
                    user_id: member.id,
                    message_id: msg.id
                });
            }     
        }  
    }
}