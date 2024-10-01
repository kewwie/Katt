import { VoiceState } from "discord.js";
import { KiwiClient } from "../../../client";
import { Event, EventList } from "../../../types/event";

import { saveVoiceState, } from "../utils/saveVoiceState";
import { removeVoiceState } from "../utils/removeVoiceState";
import { saveVoice } from "../utils/saveVoice";

/**
 * @type {Event}
 */
export const VoiceStateUpdate: Event = {
    name: EventList.VoiceStateUpdate,

    /**
     * @param {KiwiClient} client
     * @param {VoiceState} oldVoiceState
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
        if (newVoiceState.member.user.bot) return;
        console.log("Voice State Update");

        var userVoiceState = await client.db.repos.activityVoicestates
            .findOneBy({ userId: oldVoiceState.id, guildId: oldVoiceState.guild.id });

        if (userVoiceState && !newVoiceState.channelId) {
            // User left voice channel
            removeVoiceState(client, newVoiceState.guild.id, newVoiceState.id);
            
            var secondsSinceLastUpdate = (new Date().getTime() - userVoiceState.joinedAt.getTime()) / 1000;
            saveVoice(client, newVoiceState.guild.id, newVoiceState.id, secondsSinceLastUpdate);

        } else if (!userVoiceState && newVoiceState.channelId) {
            // User joined a voice channel
            saveVoiceState(client, newVoiceState.guild.id, newVoiceState.id, newVoiceState.channelId);

        } else if (userVoiceState && newVoiceState.channelId) {
            // User switched voice channel
            saveVoiceState(client, newVoiceState.guild.id, newVoiceState.id, newVoiceState.channelId);

            var secondsSinceLastUpdate = (new Date().getTime() - userVoiceState.joinedAt.getTime()) / 1000;
            saveVoice(client, newVoiceState.guild.id, newVoiceState.id, secondsSinceLastUpdate);
        }
    }
}