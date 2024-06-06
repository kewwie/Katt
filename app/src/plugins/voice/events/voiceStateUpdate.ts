import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import {
    VoiceState
} from "discord.js";

import { dataSource } from "../../../datasource";
import { VoiceChannel } from "../../../entities/VoiceChannel";
import { VoiceActivity } from "../../../entities/VoiceActivity";

/**
 * @type {Event}
 */
export const VoiceStateUpdate: Event = {
    name: Events.VoiceStateUpdate,

    /**
     * @param {VoiceState} voiceState
     */
    async getGuildId(voiceState: VoiceState) {
        return voiceState.guild.id;
    },

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

            var seconds;
            if (pva) {
                seconds = pva.seconds;
            } else {
                seconds = 0;
            }

            var secondsSinceLastUpdate = (new Date().getTime() - pvs.joinTime.getTime()) / 1000;
            var newSeconds = secondsSinceLastUpdate + seconds;

            if (pva) {
                await VoiceActivityDB.update(
                    { 
                        guildId: oldVoiceState.guild.id,
                        userId: oldVoiceState.id,
                        username: oldVoiceState.member.user.username
                    },
                    { seconds: newSeconds }
                );
            } else {
                await VoiceActivityDB.insert({ 
                    guildId: oldVoiceState.guild.id,
                    userId: oldVoiceState.id,
                    username: oldVoiceState.member.user.username,
                    seconds: newSeconds 
                });
            }

            await VoiceChannelsDB.delete(
                { userId: oldVoiceState.id, guildId: oldVoiceState.guild.id }
            );
        } else if (!pvs && newVoiceState.channelId) {
            await VoiceChannelsDB.upsert({
                userId: newVoiceState.id,
                guildId: newVoiceState.guild.id,
                joinTime: new Date()
            }, ["guildId", "userId"]);
        }
    }
}