import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { VoiceChannel } from "../../../data/entities/VoiceChannel";
import { VoiceActivity } from "../../../data/entities/VoiceActivity";

export const Ready: Event = {
    name: Events.Ready,
    once: true,

    /**
    * @param {KiwiClient} client
    */
    async execute(client: KiwiClient) {
        const VoiceChannelsDB = await dataSource.getRepository(VoiceChannel)
        const VoiceActivityDB = await dataSource.getRepository(VoiceActivity)

        var vss = await VoiceChannelsDB.find();

        for (var vs of vss) {
            var voiceState = client.guilds.cache.get(vs.guildId)?.voiceStates.cache.get(vs.userId);
            if (!voiceState) {
                await VoiceChannelsDB.delete({ userId: vs.userId, guildId: vs.guildId });
            }
        }

        for (var guild of client.guilds.cache.values()) {
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
}