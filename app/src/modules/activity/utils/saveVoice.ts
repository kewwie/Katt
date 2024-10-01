import { KiwiClient } from "../../../client";

export const saveVoice = async (client: KiwiClient, guildId: string, userId: string, seconds: number) => {
    var userVoice = await client.db.repos.activityVoice.findOneBy({ guildId, userId });
    client.db.repos.activityVoice.upsert({
        guildId: guildId,
        userId: userId,
        totalSeconds: (userVoice?.totalSeconds || 0) + seconds,
        dailySeconds: (userVoice?.dailySeconds || 0) + seconds,
        weeklySeconds: (userVoice?.weeklySeconds || 0) + seconds,
        monthlySeconds: (userVoice?.monthlySeconds || 0) + seconds
    }, ['guildId', 'userId']);
}