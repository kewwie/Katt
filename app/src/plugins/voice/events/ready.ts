import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../data/datasource";
import { VoiceChannel } from "../../../data/entities/VoiceChannel";
import { VoiceActivity } from "../../../data/entities/VoiceActivity";

import { VoicePlugin } from "..";

export const Ready: Event = {
    name: Events.Ready,
    once: true,
    manualCheck: true,

    /**
    * @param {KiwiClient} client
    */
    async execute(client: KiwiClient) {
        const VoiceChannelsDB = await dataSource.getRepository(VoiceChannel)
        const VoiceActivityDB = await dataSource.getRepository(VoiceActivity)

        var vss = await VoiceChannelsDB.find();

        for (var vs of vss) {
            var voiceState = (await client.guilds.fetch(vs.guildId)).voiceStates.cache.get(vs.userId);

            if (await client.getGuildPlugin(vs.guildId, VoicePlugin.config.name)) {
                if (!voiceState) {
                    await VoiceChannelsDB.delete({ userId: vs.userId, guildId: vs.guildId });
                }
            }
        }

        for (var guild of client.guilds.cache.values()) {
            if (await client.getGuildPlugin(guild.id, VoicePlugin.config.name)) {
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
}