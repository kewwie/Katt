import { VoiceState } from "discord.js";
import { KiwiClient } from "../client";
import { Event, EventList } from "../types/event";
import { ActivityVoiceEntity } from "../entities/ActivityVoice";

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

    var userVoiceState = await client.db.repos.activityVoicestates.findOneBy({ userId: oldVoiceState.id, guildId: oldVoiceState.guild.id });
    var userVoice = await client.db.repos.activityVoice.findOneBy({ userId: oldVoiceState.id, guildId: oldVoiceState.guild.id });

    if (userVoiceState && !newVoiceState.channelId) {
        // User left voice channel
        client.db.repos.activityVoicestates.delete(userVoiceState);
        
        var secondsSinceLastUpdate = (new Date().getTime() - userVoiceState.joinedAt.getTime()) / 1000;
        client.db.repos.activityVoice.save({
            guildId: newVoiceState.guild.id,
            userId: newVoiceState.id,
            totalSeconds: secondsSinceLastUpdate + (userVoice?.totalSeconds || 0),
            dailySeconds: secondsSinceLastUpdate + (userVoice?.dailySeconds || 0),
            weeklySeconds: secondsSinceLastUpdate + (userVoice?.weeklySeconds || 0),
            monthlySeconds: secondsSinceLastUpdate + (userVoice?.monthlySeconds || 0)
        });

    } else if (!userVoiceState && newVoiceState.channelId) {
        // User joined a voice channel
        client.db.repos.activityVoicestates.save({
            guildId: newVoiceState.guild.id,
            userId: newVoiceState.id,
            channelId: newVoiceState.channelId,
            joinedAt: new Date()
        });

    } else if (userVoiceState && newVoiceState.channelId) {
        // User switched voice channel
        userVoiceState.channelId = newVoiceState.channelId;
        userVoiceState.joinedAt = new Date();
        client.db.repos.activityVoicestates.save(userVoiceState);

        var secondsSinceLastUpdate = (new Date().getTime() - userVoiceState.joinedAt.getTime()) / 1000;
        client.db.repos.activityVoice.save({
            guildId: newVoiceState.guild.id,
            userId: newVoiceState.id,
            totalSeconds: secondsSinceLastUpdate + (userVoice?.totalSeconds || 0),
            dailySeconds: secondsSinceLastUpdate + (userVoice?.dailySeconds || 0),
            weeklySeconds: secondsSinceLastUpdate + (userVoice?.weeklySeconds || 0),
            monthlySeconds: secondsSinceLastUpdate + (userVoice?.monthlySeconds || 0)
        });
    }
}