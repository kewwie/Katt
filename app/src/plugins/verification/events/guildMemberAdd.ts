import {
	ButtonBuilder,
	ActionRowBuilder,
    EmbedBuilder,
    GuildMember
} from "discord.js";

import { KiwiClient } from "../../../client";
import { ChannelType } from "discord-api-types/v10";

import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { Guild } from "../../../data/entities/Guild";

import { AcceptGuest } from "../buttons/accept-guest";
import { AcceptMember } from "../buttons/accept-member";

export const GuildMemberAdd: Event = {
    name: Events.guildMemberAdd,

    /**
    * 
    * @param {KiwiClient} client
    * @param {GuildMember} member
    */
    async execute(client: KiwiClient, member: GuildMember) {
        const GuildRepository = await dataSource.getRepository(Guild);
        const guild = await GuildRepository.findOne({ where: { guildId: member.guild.id } });

        /*var blacklist = await client.database.db("kiwi").collection("blacklist").findOne(
            { userId: member.user.id }
        );
        var whitelist = await client.database.db("kiwi").collection("whitelist").findOne(
            { userId: member.user.id }
        );

        if (blacklist) {
            try {
                await member.kick();
                if (guild?.logsChannel) {

                    var log = await member.guild.channels.cache.get(guild.logsChannel);
                    if (log && log.type === ChannelType.GuildText) {
                        var em = new EmbedBuilder()
                        .setTitle(member.user.username + "#" + member.user.discriminator)
                        .setThumbnail(member.user.avatarURL())
                        .addFields(
                            { name: "Mention", value: `<@${member.user.id}>` },
                            { name: "Blacklisted By", value: `<@${blacklist.createdBy}>` },
                            { name: "Blacklisted", value: "True" },
                            { name: "Action", value: "Kicked" }
                        )
                        .setColor(0xFF474D)
    
                        await log.send({
                            embeds: [em]
                        });
                    };
                }
                return;
            } catch (e) {
                console.error("Failed to kick user from the guild.");
            }

        } else if (whitelist) {
            try {
                client.emit("guildMemberVerify", member, whitelist.level, whitelist.createdBy, true);
            } catch (e) {
                console.log(e)
                console.error("Failed to verify user");
            }
        
        } else*/ if (guild && guild.pendingChannel) {
            
            var pendingChannel = await member.guild.channels.fetch(guild.pendingChannel);
            if (pendingChannel && pendingChannel.type === ChannelType.GuildText) {

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

                var denyButton = new ButtonBuilder()
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
