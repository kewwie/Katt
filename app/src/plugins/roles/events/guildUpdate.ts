import {
    Guild
} from "discord.js";

import { KiwiClient } from "../../../client";

import { Events, Event } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildAdminEntity } from "../../../entities/GuildUser";

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
        const GuildAdminRepository = await dataSource.getRepository(GuildAdminEntity);

        if (oldGuild.ownerId !== newGuild.ownerId) {
            var admin = await GuildAdminRepository.findOne({
                where: {
                    guildId: newGuild.id,
                    userId: newGuild.ownerId
                }
            });
            var member = await newGuild.members.fetch(newGuild.ownerId);

            if (admin) {
                GuildAdminRepository.update({
                    guildId: newGuild.id,
                    userId: newGuild.ownerId
                }, { level: 4, userName: member.user.username});
            } else {
                GuildAdminRepository.insert({
                    guildId: newGuild.id,
                    userId: newGuild.ownerId,
                    userName: member.user.username,
                    level: 4
                });
            }
            client.emit(Events.GuildAdminAdd, newGuild, member);

            var oldOwner = await GuildAdminRepository.findOne({ where: { guildId: oldGuild.id, userId: oldGuild.ownerId } });
            if (oldOwner) {
                GuildAdminRepository.delete({ guildId: oldGuild.id, userId: oldGuild.ownerId });
            }
            client.emit(Events.GuildAdminRemove, newGuild, await newGuild.members.fetch(oldGuild.ownerId));
        }
    }
}