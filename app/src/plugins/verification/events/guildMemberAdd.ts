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
import { ApproveMember } from "../buttons/approve-member";
import { DenyUser } from "../buttons/deny-user";

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
        var g = await GuildConfigRepository.findOne({ where: { guildId: member.guild.id } });
        var isAdmin = await GuildAdminsRepository.findOne({ where: { guildId: member.guild.id, userId: member.id } });

        if (isAdmin) {
            var adminRole = await member.guild.roles.fetch(g.adminRole);
            if (adminRole) {
                await member.roles.add(adminRole).catch(() => {});

                if (g.logsChannel) {
                    var log = await member.guild.channels.fetch(g.logsChannel) as TextChannel;
                    if (!log) return;
        
                    var em = new EmbedBuilder()
                        .setTitle("Auto Approved Admin")
                        .setThumbnail(member.user.avatarURL())
                        .setColor(0x90EE90)
                        .addFields(
                            { name: "User", value: `<@${member.user.id}>\n${member.user.username}` },
                            { name: "Type", value: "Admin" },
                            { name: "Auth", value: "False" }
                        )
        
                    await log.send({
                        embeds: [em]
                    });
                }
            }
        } else {
            if (g.pendingChannel) {
                var pending = await member.guild.channels.fetch(g.pendingChannel) as TextChannel;
                if (!pending) return;
    
                var em = new EmbedBuilder()
                    .setTitle("Auto Approved Admin")
                    .setThumbnail(member.user.avatarURL())
                    .setColor(0xADD8E6)
                    .addFields(
                        { name: "ID", value: `${member.user.id}` },
                        { name: "User", value: `<@${member.user.id}>` },
                        { name: "Username", value: `${member.user.username}` },
                        { name: "Auth", value: "False" }
                    )
                
                var rows = new Array();

                rows.push(new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder(ApproveGuest.config)
                            .setCustomId("approve-guest_" + member.id)
                    ])
                );

                rows.push(new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder(ApproveMember.config)
                            .setCustomId("approve-member_" + member.id)
                    ])
                );
                
                rows.push(new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder(DenyUser.config)
                            .setCustomId("deny-user_" + member.id)
                    ])
                );

                await pending.send({
                    content: g.verificationPing ? `<@&${g.verificationPing}>` : "@everyone",
                    embeds: [em],
                    components: rows
                });
            }     
        }  
    }
}