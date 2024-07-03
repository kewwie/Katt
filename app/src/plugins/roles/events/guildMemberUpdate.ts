import { GuildMember } from "discord.js";
import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildUserEntity } from "../../../entities/GuildUser";

/**
 * @type {Event}
 */
export const GuildMemberUpdate: Event = {
    name: Events.GuildMemberUpdate,

    /**
     * @param {Guild} guild
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
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: newMember.guild.id } });
        let roles = {
            level5: guildConfig.levelFive,
            level4: guildConfig.levelFour,
            level3: guildConfig.levelThree,
            level2: guildConfig.levelTwo,
            level1: guildConfig.levelOne
        }

        var user = await GuildUserRepository.findOne({ where: { guildId: newMember.guild.id, userId: newMember.id } });

        for (var role of newMember.roles.cache.values()) {
            switch (role.id) {
                case roles.level5: {
                    if (user.level >= 5) newMember.roles.remove(roles.level5);
                    break;
                }

                case roles.level4: {
                    if (user.level >= 4) newMember.roles.remove(roles.level4);
                    break;
                }

                case roles.level3: {
                    if (user.level >= 3) newMember.roles.remove(roles.level3);
                    break;
                }

                case roles.level2: {
                    if (user.level >= 2) newMember.roles.remove(roles.level2);
                    break;
                }

                case roles.level1: {
                    if (user.level >= 1) newMember.roles.remove(roles.level1);
                    break;
                }
            }
        }
    }
}