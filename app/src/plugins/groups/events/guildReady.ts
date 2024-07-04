import { Guild } from "discord.js";

import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildGroupEntity } from "../../../entities/GuildGroup";
import { GroupMemberEntity } from "../../../entities/GroupMember";
import { GuildUserEntity } from "../../../entities/GuildUser";

/**
 * @type {Event}
 */
export const GuildReady: Event = {
    name: Events.GuildReady,

    /**
     * @param {Guild} guild
     */
    async getGuildId(guild: Guild) {
        return guild.id;
    },

    /**
     * @param {KiwiClient} client
     * @param {Guild} guild
     */
    async execute(client: KiwiClient, guild: Guild) {
        const GuildGroupRepository = await dataSource.getRepository(GuildGroupEntity);
        const GroupMemberRepository = await dataSource.getRepository(GroupMemberEntity);
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);

        var groups = await GuildGroupRepository.find({ where: { guildId: guild.id }});

        for (let group of groups) {
            var members = await GroupMemberRepository.find({ where: { groupId: group.groupId }});

            for (let member of members) {
                var guildMember = await guild.members.fetch(member.userId).catch(() => {});
                if (!guildMember) continue;

                var isUser = (await GuildUserRepository.findOne({ where: { guildId: guild.id, userId: guildMember.id } }));
                if (!isUser) continue;

                var role = guildMember.roles.cache.find(role => role.id === group.roleId);
                if (role) continue;
                await guildMember.roles.add(group.roleId).catch(() => {});
            }
        }

        for (let member of (await guild.members.fetch()).values()) {
            for (let role of member.roles.cache.values()) {
                var group = await GuildGroupRepository.findOne({ where: { roleId: role.id } });
                if (!group) continue;
                
                var groupMember = await GroupMemberRepository.findOne({ where: { groupId: group.groupId, userId: member.id } });
                if (groupMember) continue;
                member.roles.remove(role.id, "User is not in the group");
            }

            for (let memberGroup of await GroupMemberRepository.find({ where: { userId: member.id } })) {
                var group = await GuildGroupRepository.findOne({ where: { guildId: guild.id, groupId: memberGroup.groupId } });
                if (!group) continue;

                var role = member.roles.cache.find(role => role.id === group.roleId);
                if (role) continue;
                await member.roles.add(group.roleId).catch(() => {});
            }
        }
    }
}