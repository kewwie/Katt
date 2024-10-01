import { KiwiClient } from "../../../client";

export const getVoiceState = async (client: KiwiClient, guildId: string, userId: string) => {
    return await client.db.repos.activityVoicestates.findOneBy({ guildId, userId });
}
