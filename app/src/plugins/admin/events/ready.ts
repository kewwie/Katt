import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { GuildAdmins } from "../../../data/entities/GuildAdmins";
import { GuildConfig } from "../../../data/entities/GuildConfig";

export const Ready: Event = {
    name: Events.Ready,
    once: true,

    /**
    * @param {KiwiClient} client
    */
    async execute(client: KiwiClient) {
        const GuildAdminsRepository = await dataSource.getRepository(GuildAdmins);
        const GuildConfigRepository = await dataSource.getRepository(GuildConfig);
        
        for (var guild of await client.guilds.fetch()) {
            var g = await guild[1].fetch();

            var guildAdmins = await GuildAdminsRepository.find({ where: { guildId: g.id } });
            if (guildAdmins) {
                for (var guildAdmin of guildAdmins) {
                    if (guildAdmin.level === 4) {
                        if (guildAdmin.userId !== g.ownerId) {
                            await GuildAdminsRepository.delete({ guildId: g.id, userId: guildAdmin.userId });
                        }
                    }
                }
            }

            var user = await client.users.fetch(g.ownerId);
            if (user) {
                var guildAdmin = guildAdmins.find(admin => admin.userId === g.ownerId);
                if (guildAdmin) {
                    await GuildAdminsRepository.update({
                        guildId: g.id,
                        userId: user.id
                    }, {
                        username: user.username,
                        level: 4
                    });
                } else {
                    await GuildAdminsRepository.insert({
                        guildId: g.id,
                        userId: user.id,
                        username: user.username,
                        level: 4
                    });
                }
            }

            var guildData = await GuildConfigRepository.findOne({ where: { guildId: guild[0] } });
            if (guildData) {
                var adminRole = await g.roles.fetch(guildData.adminRole);
                if (adminRole) {
                    var membersWithRole = await g.members.fetch();
                    for (var member of membersWithRole) {
                        var m = await member[1].fetch();
                        if (m.roles.cache.find(role => role.id === guildData.adminRole)) {
                            var isAdmin = await GuildAdminsRepository.findOne({ where: { guildId: guild[0], userId: m.id } });
                            if (!isAdmin) {
                                await m.roles.remove(adminRole);
                            }
                        }
                    }
                }
            }
        }
    }
}