import { RecurrenceRule } from "node-schedule";
import { TextChannel } from "discord.js";
import { Schedule } from "../../../types/schedule";
import { KiwiClient } from "../../../client";

import { getActivityConfig } from "../utils/getActivityConfig";
import { updateVoiceState } from "../utils/updateVoiceState";
import { saveVoice } from "../utils/saveVoice";
import { createVoiceLeaderboard } from "../utils/createVoiceLeaderboard";

var timeRule = new RecurrenceRule();
timeRule.tz = 'UTC';
timeRule.minute = 0;
timeRule.hour = 0;
timeRule.date = 1;

export const ActivityMonthlySchedule: Schedule = {
    rule: timeRule,
    execute: async (client: KiwiClient, guildId: string) => {
        var voiceStates = await client.db.repos.activityVoicestates.findBy({ guildId: guildId });
        for (var userVoiceState of voiceStates) {
            var secondsSinceLastUpdate = (new Date().getTime() - userVoiceState.joinedAt.getTime()) / 1000;
            updateVoiceState(client, guildId, userVoiceState.userId, userVoiceState.channelId);
            await saveVoice(client, guildId, userVoiceState.userId, secondsSinceLastUpdate);
        }

        var actConf = await getActivityConfig(client, guildId);
        if (actConf?.logChannel) {
            let lb = await createVoiceLeaderboard(client, guildId, "monthly");
            var channel = client.channels.cache.get(actConf.logChannel) as TextChannel;
            if (channel) {
                channel.send(lb.content);
            }
        }
        
        client.db.repos.activityVoice.update({
            guildId: guildId
        }, {
            monthlySeconds: 0
        })
    }
}
