import {
	ButtonBuilder,
	ActionRowBuilder,
    EmbedBuilder,
    GuildMember,
    TextChannel
} from "discord.js";

import { KiwiClient } from "../../../client";
import { ChannelType } from "discord-api-types/v10";

import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { Guild } from "../../../data/entities/Guild";
import { Blacklist } from "../../../data/entities/Blacklist";
import { Whitelist } from "../../../data/entities/Whitelist";
import { Group } from "../../../data/entities/Group";
import { GroupMember } from "../../../data/entities/GroupMember";

import { AcceptGuest } from "../buttons/accept-guest";
import { AcceptMember } from "../buttons/accept-member";
import { DenyUser } from "../buttons/deny-user";

export const GuildMemberAdd: Event = {
    name: Events.GuildMemberAdd,

    /**
    * 
    * @param {KiwiClient} client
    * @param {GuildMember} member
    */
    async execute(client: KiwiClient, member: GuildMember) {
        const GuildRepository = await dataSource.getRepository(Guild);
        const BlacklistRepository = await dataSource.getRepository(Blacklist);
        const WhitelistRepository = await dataSource.getRepository(Whitelist);

        const GroupRepository = await dataSource.getRepository(Group);
        const GroupMembersRepository = await dataSource.getRepository(GroupMember);
        
        const guild = await GuildRepository.findOne({ where: { guildId: member.guild.id } });

        const blacklisted = await BlacklistRepository.findOne({ where: { userId: member.user.id } });
        const whitelisted = await WhitelistRepository.findOne({ where: { userId: member.user.id } });

        if (member.user.bot && whitelisted?.level === "3" && guild.botRole) {
            var botRole = member.guild.roles.cache.find(role => role.id === guild.botRole);
            if (botRole) {
                await member.roles.add(botRole);
            }
            return;
        } else if (member.user.bot && whitelisted?.level !== "3") {
            await member.kick("Bots must be whitelisted");
            return;
        }

        if (blacklisted) {
            await member.kick("User is blacklisted");
            if (guild.logsChannel) {
                var log = member.guild.channels.cache.get(guild.logsChannel) as TextChannel;
                if (!log) return;
                var em = new EmbedBuilder()
                .setTitle(member.user.username + "#" + member.user.discriminator)
                .setThumbnail(member.user.avatarURL())
                .addFields(
                    { name: "User", value: `<@${member.user.id}>\n${member.user.username}` },
                    { name: "Blacklisted By", value: `<@${blacklisted.createdBy}>` },
                    { name: "Blacklisted", value: "True" },
                    { name: "Action", value: "Kicked" }
                )
                .setColor(0xFF474D)

                await log.send({
                    embeds: [em]
                });
            }
            return;
        }

        if (whitelisted) {
            if (whitelisted.level >= "1" && guild.guestRole) {
                var guestRole = member.guild.roles.cache.find(role => role.id === guild.guestRole);
                if (guestRole) {
                    await member.roles.add(guestRole);
                }
            }

            if (whitelisted.level >= "2" && guild.memberRole) {
                var memberRole = member.guild.roles.cache.find(role => role.id === guild.memberRole);
                if (memberRole) {
                    await member.roles.add(memberRole);
                }
            }

            if (whitelisted.level === "4" && guild.adminRole) {
                var adminRole = member.guild.roles.cache.find(role => role.id === guild.adminRole);
                if (adminRole) {
                    await member.roles.add(adminRole);
                }
            }

            const groups = await GroupMembersRepository.find({ where: { userId: member.id } });
            for (const g of groups) {
                const group = await GroupRepository.findOne({ where: { groupId: g.groupId } });
                const role = member.guild.roles.cache.find(role => role.id === group.roleId);
                if (role) {
                    await member.roles.add(role);
                }
            }
            await member.send(`You have been **auto verified** in **${member.guild.name}**`);

            if (guild.logsChannel) {
                var log = member.guild.channels.cache.get(guild.logsChannel) as TextChannel;
                if (!log) return;

                var addedRoles = member.roles.cache
                    .filter((roles) => roles.id !== member.guild.id)
                    .sort((a, b) => b.rawPosition - a.rawPosition)
                    .map((role) => role.name);
    
                var em = new EmbedBuilder()
                    .setTitle(member.user.username + "#" + member.user.discriminator)
                    .setThumbnail(member.user.avatarURL())
                    .setColor(0x90EE90)
                    .addFields(
                        { name: "User", value: `<@${member.user.id}>\n${member.user.username}` },
                        { name: "Whitelisted By", value: `<@${whitelisted.createdBy}>` },
                        { name: "Whitelisted", value: `True` },
                        { name: "Roles", value: addedRoles.join(", ")}
                    )
    
                await log.send({
                    embeds: [em]
                });
            }
            return;
        }

        if (guild && guild.pendingChannel) {
            
            var pendingChannel = await member.guild.channels.fetch(guild.pendingChannel) as TextChannel;
            if (pendingChannel) {

                var verificationPing = `@everyone`;

                var em = new EmbedBuilder()
                    .setTitle(await client.getTag(
                        { name: member.user.username, discriminator: member.user.discriminator }
                    ))
                    .setThumbnail(member.user.avatarURL())
                    .setFields(
                        { name: "Mention", value: `<@${member.user.id}>`},
                        { name: "Created", value: member.user.createdAt.toDateString() }
                    )
                    .setColor(0xADD8E6);

                var rows = [];

                var acceptGuestButton = new ButtonBuilder(AcceptGuest.config)
                    .setCustomId('accept-guest_' + member.user.id);
                var acceptMemberButton = new ButtonBuilder(AcceptMember.config)
                    .setCustomId('accept-member_' + member.user.id);

                rows.push(new ActionRowBuilder().addComponents([acceptGuestButton, acceptMemberButton]));

                var denyButton = new ButtonBuilder(DenyUser.config)
                    .setCustomId('deny-user_' + member.user.id);

                rows.push(new ActionRowBuilder().addComponents([denyButton]));

                await pendingChannel.send({
                    content: verificationPing,
                    embeds: [em],
                    components: rows
                });
            }
        }
    }
}
