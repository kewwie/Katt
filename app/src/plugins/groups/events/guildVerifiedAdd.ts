import {
    Guild,
    User,
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildGroupEntity } from "../../../entities/GuildGroup";
import { GroupMemberEntity } from "../../../entities/GroupMember";

/**
 * @type {Event}
 */
export const GuildVerifiedAdd: Event = {
    name: Events.GuildVerifiedAdd,

    /**
     * @param {Guild} guild
     */
    async getGuildId(guild: Guild) {
        return guild.id;
    },

    /**
     * @param {KiwiClient} client
     * @param {Guild} guild
     * @param {User} user
     */
    async execute(client: KiwiClient, guild: Guild, user: User) {
        const GuildGroupRepository = await dataSource.getRepository(GuildGroupEntity);
        const GroupMemberRepository = await dataSource.getRepository(GroupMemberEntity);

        var groups = await GroupMemberRepository.find({ where: { userId: user.id }});

        for (let group of groups) {
            var g = await GuildGroupRepository.findOne({ where: { groupId: group.groupId }});
            if (g) {
                var guildMember = await guild.members.fetch(user.id);

                if (guildMember) {
                    var role = guildMember.roles.cache.find(role => role.id === g.roleId);
                    if (!role) {
                        await guildMember.roles.add(g.roleId).catch(() => {});
                    }
                }
            }
        }
    }
}
