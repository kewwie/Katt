import { KiwiClient } from "../../../client";

export const getActivityConfig = async (client: KiwiClient, guildId: string) => {
    return await client.db.repos.activityConfig.findOneBy({ guildId });
}