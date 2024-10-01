import { KiwiClient } from "../../../client";

export const saveVoiceState = async (client: KiwiClient, guildId: string, userId: string, channelId: string) => {
    client.db.repos.activityVoicestates.save({
        guildId: guildId,
        userId: userId,
        channelId: channelId,
        joinedAt: new Date()
    });
}