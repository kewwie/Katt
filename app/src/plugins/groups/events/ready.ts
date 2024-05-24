import { GuildMember } from "discord.js";

import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { Group } from "../../../data/entities/Group";
import { GroupMember } from "../../../data/entities/GroupMember";

import { GroupsPlugin } from "..";

/**
 * @type {Event}
 */
export const Ready: Event = {
    name: Events.Ready,
    once: true,

    /**
    * @param {KiwiClient} client
    */
    async execute(client: KiwiClient) {
        const GroupsRepository = await dataSource.getRepository(Group);
        const GroupMembersRepository = await dataSource.getRepository(GroupMember);

        for (var guild of await client.guilds.fetch()) {
            var g = await guild[1].fetch();

            if (await client.getGuildPlugin(g.id, GroupsPlugin.config.name)) {
                var groups = await GroupsRepository.find({ where: { guildId: g.id }});

                for (let group of groups) {
                    var members = await GroupMembersRepository.find({ where: { groupId: group.groupId }});

                    for (let member of members) {
                        var guildMember = await g.members.fetch(member.userId).catch(() => {});

                        if (guildMember) {
                            var role = guildMember.roles.cache.find(role => role.id === group.roleId);
                            if (!role) {
                                await guildMember.roles.add(group.roleId).catch(() => {});
                            }
                        }
                    }
                }

                for (let member of await g.members.fetch()) {
                    member[1].roles.cache.forEach(async (role) => {
                        var group = await GroupsRepository.findOne({ where: { roleId: role.id } });
                        if (group) {
                            var groupMember = await GroupMembersRepository.findOne({ where: { groupId: group.groupId, userId: member[0] } });
                            if (!groupMember) {
                                member[1].roles.remove(role.id, "User is not in the group");
                            }
                        }
                    });

                    for (let memberGroup of await GroupMembersRepository.find({ where: { userId: member[0] } })) {
                        var group = await GroupsRepository.findOne({ where: { guildId: g.id, groupId: memberGroup.groupId } });
                        if (group) {
                            var role = member[1].roles.cache.find(role => role.id === group.roleId);
                            if (!role) {
                                await member[1].roles.add(group.roleId).catch(() => {});
                            }
                        }
                    }
                }
            }
        }
    }
}