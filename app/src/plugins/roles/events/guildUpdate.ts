import {
    Guild
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildUserEntity } from "../../../entities/GuildUser";

/**
 * @type {Event}
 */
export const GuildUpdate: Event = {
    name: Events.GuildUpdate,

    /**
    * @param {Client} client
    * @param {Guild} oldGuild
    * @param {Guild} newGuild
    */
    async execute(client: KiwiClient, oldGuild: Guild, newGuild: Guild) {
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: newGuild.id } });
        let roles = [
            guildConfig.levelFive,
            guildConfig.levelFour,
            guildConfig.levelThree,
            guildConfig.levelTwo,
            guildConfig.levelOne
        ]

        if (oldGuild.ownerId !== newGuild.ownerId) {
            var isUser = await GuildUserRepository.findOne({
                where: {
                    guildId: newGuild.id,
                    userId: newGuild.ownerId
                }
            });
            var member = await newGuild.members.fetch(newGuild.ownerId);

            if (isUser) {
                GuildUserRepository.update({
                    guildId: newGuild.id,
                    userId: newGuild.ownerId
                }, { level: 5, userName: member.user.username});
            } else {
                GuildUserRepository.insert({
                    guildId: newGuild.id,
                    userId: newGuild.ownerId,
                    userName: member.user.username,
                    level: 5
                });
            }
            
            let highestRole = roles.find(role => role !== null);
            if (highestRole) {
                await member.roles.add(highestRole);
            }

            var oldOwner = await GuildUserRepository.findOne({ where: { guildId: oldGuild.id, userId: oldGuild.ownerId } });
            if (oldOwner) {
                GuildUserRepository.delete({ guildId: oldGuild.id, userId: oldGuild.ownerId });
            }

            var oldOwnerMember = await oldGuild.members.fetch(oldGuild.ownerId);
            if (oldOwnerMember) {
                oldOwnerMember.roles.remove(roles).catch(() => {});
            }
        }
    }
}