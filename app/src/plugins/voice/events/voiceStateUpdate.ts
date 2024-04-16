import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import {
    VoiceState
} from "discord.js";

import { dataSource } from "../../../data/datasource";
import { VoiceChannel } from "../../../data/entities/VoiceChannel";
import { VoiceActivity } from "../../../data/entities/VoiceActivity";

export const voiceStateUpdate: Event = {
    name: Events.VoiceStateUpdate,

    /**
    * @param {KiwiClient} client
    * @param {VoiceState} oldVoiceState
    * @param {VoiceState} newVoiceState
    */
    async execute(client: KiwiClient, oldVoiceState: VoiceState, newVoiceState: VoiceState) {
        const VoiceChannelsDB = await dataSource.getRepository(VoiceChannel)
        const VoiceActivityDB = await dataSource.getRepository(VoiceActivity)

        var pvs = await VoiceChannelsDB.findOne(
            { where: { userId: oldVoiceState.id, guildId: oldVoiceState.guild.id }}
        );

        if (pvs && !newVoiceState.channelId) {
            var pva = await VoiceActivityDB.findOne(
                { where: { userId: oldVoiceState.id, guildId: oldVoiceState.guild.id }}
            );

            var minutes;
            if (pva) {
                minutes = pva.minutes;
            } else {
                minutes = 0;
            }

            var minutesSinceLastUpdate = (new Date().getTime() - pvs.joinTime.getTime()) / (1000 * 60);
            var newMinutes = minutesSinceLastUpdate + minutes;
            
            await VoiceActivityDB.upsert({
                userId: oldVoiceState.id,
                guildId: oldVoiceState.guild.id,
                minutes: newMinutes
            }, ["userId", "guildId"]);

            await VoiceChannelsDB.delete(
                { userId: oldVoiceState.id, guildId: oldVoiceState.guild.id }
            );
        } else if (!oldVoiceState.channelId && newVoiceState.channelId) {
            await VoiceChannelsDB.upsert({
                userId: newVoiceState.id,
                guildId: newVoiceState.guild.id,
                joinTime: new Date()
            }, ["userId", "guildId"]);
        }
    }
}