import { KiwiClient } from "../client";

export const saveVoiceState = async (client: KiwiClient, guildId: string, userId: string, channelId: string) => {
    client.db.repos.activityVoicestates.save({
        guildId: guildId,
        userId: userId,
        channelId: channelId,
        joinedAt: new Date()
    });
}

export const removeVoiceState = async (client: KiwiClient, guildId: string, userId: string) => {
    var voiceState = await client.db.repos.activityVoicestates.findOneBy({ guildId, userId });
    if (voiceState) {
        await client.db.repos.activityVoicestates.delete(voiceState);
    }
}

export const saveVoice = async (client: KiwiClient, guildId: string, userId: string, seconds: number) => {
    var userVoice = await client.db.repos.activityVoice.findOneBy({ guildId, userId });
    client.db.repos.activityVoice.save({
        guildId: guildId,
        userId: userId,
        totalSeconds: (userVoice?.totalSeconds || 0) + seconds,
        dailySeconds: (userVoice?.dailySeconds || 0) + seconds,
        weeklySeconds: (userVoice?.weeklySeconds || 0) + seconds,
        monthlySeconds: (userVoice?.monthlySeconds || 0) + seconds
    });
}