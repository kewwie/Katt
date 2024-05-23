import {
    Guild,
    User,
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { Group } from "../../../data/entities/Group";
import { GroupMember } from "../../../data/entities/GroupMember";


/**
 * @type {Event}
 */
export const GuildVerifiedAdd: Event = {
    name: Events.GuildVerifiedAdd,

    /**
    * @param {KiwiClient} client
    * @param {Guild} user
    * @param {User} user
    */
    async execute(client: KiwiClient, guild: Guild, user: User) {
        const GroupRepository = await dataSource.getRepository(Group);
        const GroupMembersRepository = await dataSource.getRepository(GroupMember);

        var groups = await GroupMembersRepository.find({ where: { userId: user.id }});

        for (let group of groups) {
            var g = await GroupRepository.findOne({ where: { groupId: group.groupId }});
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
