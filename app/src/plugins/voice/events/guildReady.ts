import { Guild } from "discord.js";

import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { VoiceStateEntity } from "../../../entities/VoiceState";

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
        const VoiceStateRepository = await dataSource.getRepository(VoiceStateEntity)

        for (var vs of await VoiceStateRepository.find({ where: { guildId: guild.id } })) {
            if (!guild.voiceStates.cache.get(vs.userId)) {
                await VoiceStateRepository.delete({ userId: vs.userId, guildId: vs.guildId });
            }
        }

        for (var voiceState of guild.voiceStates.cache.values()) {

            var vs = await VoiceStateRepository.findOne(
                { where: { userId: voiceState.id, guildId: voiceState.guild.id }}
            );

            if (!vs) {
                await VoiceStateRepository.upsert(
                    { userId: voiceState.id, guildId: voiceState.guild.id, joinTime: new Date() },
                    ["userId", "guildId"]
                );
            }
        }
    }
}