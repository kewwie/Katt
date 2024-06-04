import { Guild } from "discord.js";

import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { VoiceChannel } from "../../../data/entities/VoiceChannel";

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
        const VoiceChannelsDB = await dataSource.getRepository(VoiceChannel)

        for (var vs of await VoiceChannelsDB.find({ where: { guildId: guild.id } })) {
            if (!guild.voiceStates.cache.get(vs.userId)) {
                await VoiceChannelsDB.delete({ userId: vs.userId, guildId: vs.guildId });
            }
        }

        for (var voiceState of guild.voiceStates.cache.values()) {

            var vs = await VoiceChannelsDB.findOne(
                { where: { userId: voiceState.id, guildId: voiceState.guild.id }}
            );

            if (!vs) {
                await VoiceChannelsDB.upsert(
                    { userId: voiceState.id, guildId: voiceState.guild.id, joinTime: new Date() },
                    ["userId", "guildId"]
                );
            }
        }
    }
}