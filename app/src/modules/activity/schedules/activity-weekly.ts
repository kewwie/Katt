import { RecurrenceRule } from "node-schedule";
import { TextChannel } from "discord.js";
import { Schedule } from "../../../types/schedule";
import { KiwiClient } from "../../../client";

import { getActivityConfig } from "../utils/getActivityConfig";
import { updateVoiceState } from "../utils/updateVoiceState";
import { saveVoice } from "../utils/saveVoice";
import { grantMostActiveRole } from "../utils/grantMostActiveRole";
import { createVoiceLeaderboard } from "../utils/createVoiceLeaderboard";

var timeRule = new RecurrenceRule();
timeRule.tz = 'UTC';
timeRule.minute = 0;
timeRule.hour = 0;
timeRule.dayOfWeek = 1;

export const ActivityWeeklySchedule: Schedule = {
    rule: timeRule,
    execute: async (client: KiwiClient, guildId: string) => {
        console.log("Weekly Activity");
        var voiceStates = await client.db.repos.activityVoicestates.findBy({ guildId: guildId });
        for (var userVoiceState of voiceStates) {
            var secondsSinceLastUpdate = (new Date().getTime() - userVoiceState.joinedAt.getTime()) / 1000;
            updateVoiceState(client, guildId, userVoiceState.userId, userVoiceState.channelId);
            await saveVoice(client, guildId, userVoiceState.userId, secondsSinceLastUpdate);
        }

        await grantMostActiveRole(client, guildId, "weekly");
        var actConf = await getActivityConfig(client, guildId);
        if (actConf?.logChannel) {
            let lb = await createVoiceLeaderboard(client, guildId, "weekly");
            var channel = client.channels.cache.get(actConf.logChannel) as TextChannel;
            if (channel) {
                channel.send(lb.content);
            }
        }
        
        client.db.repos.activityVoice.update({
            guildId: guildId
        }, {
            weeklySeconds: 0
        })
    }
}
