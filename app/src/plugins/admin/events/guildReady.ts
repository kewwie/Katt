import { Guild, GuildMember } from "discord.js";

import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { GuildAdmins } from "../../../data/entities/GuildAdmins";
import { GuildConfig } from "../../../data/entities/GuildConfig";

/**
 * @type {Event}
 */
export const GuildReady: Event = {
    name: Events.GuildReady,

    /**
    * @param {KiwiClient} client
    */
    async execute(client: KiwiClient, guild: Guild) {
        const GuildAdminsRepository = await dataSource.getRepository(GuildAdmins);
        const GuildConfigRepository = await dataSource.getRepository(GuildConfig);


            var guildAdmins = await GuildAdminsRepository.find({ where: { guildId: guild.id } });
            if (guildAdmins) {
                for (var guildAdmin of guildAdmins) {
                    if (guildAdmin.level === 4) {
                        if (guildAdmin.userId !== guild.ownerId) {
                            await GuildAdminsRepository.delete({ guildId: guild.id, userId: guildAdmin.userId });
                        }
                    }
                }
            }

            var user = await client.users.fetch(guild.ownerId);
            if (user) {
                var guildAdmin = guildAdmins.find(admin => admin.userId === guild.ownerId);
                if (guildAdmin) {
                    await GuildAdminsRepository.update({
                        guildId: guild.id,
                        userId: user.id
                    }, {
                        username: user.username,
                        level: 4
                    });
                } else {
                    await GuildAdminsRepository.insert({
                        guildId: guild.id,
                        userId: user.id,
                        username: user.username,
                        level: 4
                    });
                }
            }

            var guildAdmins = await GuildAdminsRepository.find({ where: { guildId: guild.id } });
            var guildData = await GuildConfigRepository.findOne({ where: { guildId: guild[0] } });
            if (guildData) {
                var adminRole = await guild.roles.fetch(guildData.adminRole);
                if (adminRole) {
                    for (var member of adminRole.members) {
                        var m = await member[1].fetch();
                        if (m.roles.cache.find(role => role.id === guildData.adminRole)) {
                            var isAdmin = await GuildAdminsRepository.findOne({ where: { guildId: guild[0], userId: m.id } });
                            if (!isAdmin) {
                                await m.roles.remove(adminRole).catch(() => {});
                            }
                        }
                    }

                    for (var guildAdmin of guildAdmins) {
                        var m: GuildMember | null = await guild.members.fetch(guildAdmin.userId).catch(() => { return null });
                        if (m) {
                            var adminRole = m.roles.cache.find(role => role.id === guildData.adminRole);
                            if (!adminRole) {
                                await m.roles.add(guildData.adminRole).catch(() => {});
                            }
                        }
                    }
                }
            }
    }
}