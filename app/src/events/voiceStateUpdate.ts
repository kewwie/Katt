import { VoiceState } from "discord.js";
import { KiwiClient } from "../client";
import { Event, EventList } from "../types/event";

import { saveVoiceState, removeVoiceState, saveVoice } from "../utils/activity";

/**
 * @type {Event}
 */
export const VoiceStateUpdate: Event = {
    name: EventList.VoiceStateUpdate,

    /**
    * @param {KiwiClient} client
    */
    async execute(client: KiwiClient, oldVoiceState: VoiceState, newVoiceState: VoiceState) {
        console.log("Voice State Update", await client.db.isModuleEnabled(newVoiceState.guild.id, "activity"));
        if (await client.db.isModuleEnabled(newVoiceState.guild.id, "activity")) {
            ActivityEvent(client, oldVoiceState, newVoiceState);
        }
    }
}

const ActivityEvent = async (client: KiwiClient, oldVoiceState: VoiceState, newVoiceState: VoiceState) => {
    if (newVoiceState.member.user.bot) return;

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