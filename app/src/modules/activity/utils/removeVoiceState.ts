import { KiwiClient } from "../../../client";

export const removeVoiceState = async (client: KiwiClient, guildId: string, userId: string) => {
    var voiceState = await client.db.repos.activityVoicestates.findOneBy({ guildId, userId });
    if (voiceState) {
        await client.db.repos.activityVoicestates.delete(voiceState);
    }
}