import { RecurrenceRule } from "node-schedule";
import { Schedule } from "../../../types/schedule";
import { KiwiClient } from "../../../client";

import { getActivityConfig, saveVoice, updateVoiceState } from "../utils/activity";
import { TextChannel } from "discord.js";

var timeRule = new RecurrenceRule();
timeRule.tz = 'UTC';
timeRule.hour = 0;
timeRule.minute = 0

export const ActivityDailySchedule: Schedule = {
    rule: timeRule,
    execute: async (client: KiwiClient, guildId: string) => {
        console.log("Daily Activity");
        var voiceStates = await client.db.repos.activityVoicestates.findBy({ guildId: guildId });
        for (var userVoiceState of voiceStates) {
            var secondsSinceLastUpdate = (new Date().getTime() - userVoiceState.joinedAt.getTime()) / 1000;
            updateVoiceState(client, guildId, userVoiceState.userId, userVoiceState.channelId);
            await saveVoice(client, guildId, userVoiceState.userId, secondsSinceLastUpdate);
        }

        await grantMostActiveRole(client, guildId);

        client.db.repos.activityVoice.save({
            guildId: guildId,
            userId: userVoiceState.userId,
            dailySeconds: 0
        })

    }
}


const grantMostActiveRole = async (client: KiwiClient, guildId: string) => {
    var activeUserVoice = await client.db.repos.activityVoice
            .findOne({ where: { guildId: guildId }, order: { dailySeconds: "DESC" } });
    if (!activeUserVoice) return;

    var actConf = await getActivityConfig(client, guildId);
    if (!actConf) return;

    var guild = await client.guilds.fetch(guildId);
    if (!guild) return;

    var activeMember = await guild.members.fetch(activeUserVoice.userId);
    if (!activeMember) return;
    
    var mostActiveRole = await guild.roles.fetch(actConf.mostActiveRole);
    if (!mostActiveRole) return;
    mostActiveRole.members.forEach(member => member.roles.remove(mostActiveRole).catch());

    activeMember.roles.add(mostActiveRole).catch();

    var logChannel = await client.channels.fetch(actConf.logChannel) as TextChannel;
    if (!logChannel) return;
    logChannel.send(`Congratulations <@${activeMember.id}>! You are the most active user today with ${activeUserVoice.dailySeconds / 60} minutes!`);
}
