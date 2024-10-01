import { KiwiClient } from "../../../client";

export const updateVoiceState = async (client: KiwiClient, guildId: string, userId: string, channelId: string) => {
    client.db.repos.activityVoicestates.update(
        { 
            guildId,
            userId
        }, { 
            channelId, 
            joinedAt: new Date()
        });
}