import { KiwiClient } from "../../../client";

import { getActivityConfig } from "./getActivityConfig";

export const grantMostActiveRole = async (
    client: KiwiClient, guildId: string, type: "daily" | "weekly"
) => {
    var activeUserVoice = await client.db.repos.activityVoice
            .findOne({ where: { guildId: guildId }, order: { dailySeconds: "DESC" } });
    if (!activeUserVoice) return;

    var actConf = await getActivityConfig(client, guildId);
    if (!actConf) return;

    var guild = await client.guilds.fetch(guildId);
    if (!guild) return;

    var activeMember = await guild.members.fetch(activeUserVoice.userId);
    if (!activeMember) return;
    
    var mostActiveRole;
    if (type === "daily") mostActiveRole = guild.roles.cache.get(actConf.dailyActiveRole);
    if (type === "weekly") mostActiveRole = guild.roles.cache.get(actConf.weeklyActiveRole);

    if (!mostActiveRole) return;
    mostActiveRole.members.forEach(async (member) => await member.roles.remove(mostActiveRole).catch());

    activeMember.roles.add(mostActiveRole).catch(e => console.log(e));
}