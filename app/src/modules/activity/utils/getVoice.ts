import { KiwiClient } from "../../../client";

export const getVoice = async (client: KiwiClient, guildId: string, userId: string) => {
    return await client.db.repos.activityVoice.findOneBy({ guildId, userId });
}