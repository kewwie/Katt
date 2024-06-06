import {
    GuildMember
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildGroupEntity } from "../../../entities/GuildGroup";
import { GroupMemberEntity } from "../../../entities/GroupMember";

/**
 * @type {Event}
 */
export const GuildMemberUpdate: Event = {
    name: Events.GuildMemberUpdate,

    /**
     * @param {GuildMember} member
     */
    async getGuildId(member: GuildMember) {
        return member.guild.id;
    },

    /**
    * @param {Client} client
    * @param {GuildMember} oldMember
    * @param {GuildMember} newMember
    */
    async execute(client: KiwiClient, oldMember: GuildMember, newMember: GuildMember) {
        const GuildGroupRepository = await dataSource.getRepository(GuildGroupEntity);
        const GroupMemberRepository = await dataSource.getRepository(GroupMemberEntity);
            
        newMember.roles.cache.forEach(async (role) => {
            var group = await GuildGroupRepository.findOne({ where: { roleId: role.id } });
            if (group) {
                var groupMember = await GroupMemberRepository.findOne({ where: { groupId: group.groupId, userId: newMember.id } });
                if (!groupMember) {
                    newMember.roles.remove(role.id, "User is not in the group");
                }
            }
        });

        for (var groupMember of await GroupMemberRepository.find({ where: { userId: newMember.id } })) {
            var group = await GuildGroupRepository.findOne({ where: { guildId: newMember.guild.id, groupId: groupMember.groupId } });
            if (group) {
                var role = newMember.guild.roles.cache.get(group.roleId);
                if (role && !newMember.roles.cache.has(role.id)) {
                    newMember.roles.add(role.id, "User is a member of the group");
                }
            }
        }
    }
}