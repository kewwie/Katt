import { KiwiClient } from "../client";
import { Event, Events } from "../types/event";
import { env } from "../env";

import { dataSource } from "../data/datasource";
import { VoiceChannel } from "../data/entities/VoiceChannel";
import { VoiceActivity } from "../data/entities/VoiceActivity";


export const Ready: Event = {
    name: Events.ready,
    once: true,

    /**
    * 
    * @param {KiwiClient} client
    */
    async execute(client: KiwiClient) {
        /*console.log(`${client.user?.username} is Online`);

        for (let guild of client.guilds.cache.values()) {
            await client.commandHandler.unregister(guild.id);
        }
        //await client.commandHandler.unregister();

        if (env.TEST_GUILD) {
            await client.commandHandler.register(Array.from(client.commands.values()), env.TEST_GUILD);
        } else {
            await client.commandHandler.register(Array.from(client.commands.values()));
        }

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

                var va = await VoiceActivityDB.findOne(
                    { where: { userId: voiceState.id, guildId: voiceState.guild.id }}
                );

                if (vs && vs.joinTime) {
                    
                    let newMinutes = (Date.now() - vs.joinTime) / (1000 * 60) + va.minutes;

                    await VoiceActivityDB.update(
                        { userId: voiceState.id, guildId: voiceState.guild.id },
                        { minutes: newMinutes },
                    );
                } else {
                    await VoiceChannelsDB.upsert(
                        { userId: voiceState.id, guildId: voiceState.guild.id, joinTime: Date.now() },
                        ["userId", "guildId"]
                    );
                }
            }
        }*/
    }
}