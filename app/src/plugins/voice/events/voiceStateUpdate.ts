import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import {
    VoiceState
} from "discord.js";

import { dataSource } from "../../../datasource";
import { VoiceStateEntity } from "../../../entities/VoiceState";
import { VoiceActivityEntity } from "../../../entities/VoiceActivity";

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
        const VoiceStateRepository = await dataSource.getRepository(VoiceStateEntity)
        const VoiceActivityRepository = await dataSource.getRepository(VoiceActivityEntity)

        if (newVoiceState.member.user.bot) return;

        var pvs = await VoiceStateRepository.findOne(
            { where: { userId: oldVoiceState.id, guildId: oldVoiceState.guild.id }}
        );

        if (pvs && !newVoiceState.channelId) {
            var pva = await VoiceActivityRepository.findOne(
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
                await VoiceActivityRepository.update(
                    { 
                        guildId: oldVoiceState.guild.id,
                        userId: oldVoiceState.id,
                        userName: oldVoiceState.member.user.username
                    },
                    { seconds: newSeconds }
                );
            } else {
                await VoiceActivityRepository.insert({ 
                    guildId: oldVoiceState.guild.id,
                    userId: oldVoiceState.id,
                    userName: oldVoiceState.member.user.username,
                    seconds: newSeconds 
                });
            }

            await VoiceStateRepository.delete(
                { userId: oldVoiceState.id, guildId: oldVoiceState.guild.id }
            );
        } else if (!pvs && newVoiceState.channelId) {
            await VoiceStateRepository.upsert({
                userId: newVoiceState.id,
                guildId: newVoiceState.guild.id,
                joinTime: new Date()
            }, ["guildId", "userId"]);
        }
    }
}