import { KiwiClient } from "../client";
import { Event, Events } from "../types/event";


import {
    GuildMember,
    EmbedBuilder
} from "discord.js";

export const event: Event = {
    name: Events.memberVerify,

    /**
    * 
    * @param {KiwiClient} client
    * @param {GuildMember} member
    * @param {String} level
    */
    async execute(client: KiwiClient, member: GuildMember, level: string, by: string, whitelist: boolean = false) {
            try {
                const guilds = await client.database.db("kiwi").collection("guilds").findOne(
                    { guildId: member.guild.id }
                );

                if (level === "guest") {
                    var guestRole = await member.guild.roles.cache.find(role => role.id === guilds.guestRole);
                    if (guestRole) {
                        await member.roles.add(guestRole);
                    }
                }
                if (level === "member") {
                    var memberRole = await member.guild.roles.cache.find(role => role.id ===  guilds.memberRole);
                    if (memberRole) {
                        await member.roles.add(memberRole);
                    }
                    var guest = await member.guild.roles.cache.find(role => role.id ===  guilds.guestRole);
                    if (guest) {
                        await member.roles.add(guest);
                    }
                }

                const groups = await client.database.db("kiwi").collection("groups").find({ guildId: member.guild.id, members: { $in: [member.id] } }).toArray();
                for (const group of groups) {
                    const role = await member.guild.roles.cache.find(role => role.id === group.roleId);
                    if (role) {
                        await member.roles.add(role);
                    }
                }

                if (guilds.logsChannel) {
                    var log = await member.guild.channels.cache.get(guilds.logsChannel);
                    var addedRoles = member.roles.cache
                        .filter((roles) => roles.id !== member.guild.id)
                        .sort((a, b) => b.rawPosition - a.rawPosition)
                        .map((role) => role.name);

                    var em = new EmbedBuilder()
                        .setTitle(member.user.username + "#" + member.user.discriminator)
                        .setThumbnail(member.user.avatarURL())
                        .setColor(0x90EE90);

                    if (whitelist) {
                        em.addFields(
                            { name: "Mention", value: `<@${member.user.id}>` },
                            { name: "Whitelisted By", value: `<@${by}>` },
                            { name: "Whitelisted", value: "True"},
                            { name: "Roles", value: addedRoles.join(", ")}
                        );
                    } else {
                        em.addFields(
                            { name: "Mention", value: `<@${member.user.id}>` },
                            { name: "Verified By", value: `<@${by}>` },
                            { name: "Roles", value: addedRoles.join(", ")}
                        )
                    }

                    await log.send({
                        embeds: [em]
                    });
                }
            } catch (e) {
                console.log(e)
                console.error("Failed to add roles to user.");
            }
        }
}