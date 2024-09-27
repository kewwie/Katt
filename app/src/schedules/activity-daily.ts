import { RecurrenceRule } from "node-schedule";
import { Schedule } from "../types/schedule";
import { KiwiClient } from "../client";

import { saveVoice, updateVoiceState } from "../utils/activity";

var timeRule = new RecurrenceRule();
timeRule.tz = 'CST';
timeRule.hour = 0;
timeRule.minute = 0

export const ActivityDailySchedule: Schedule = {
    rule: timeRule,
    execute: async (client: KiwiClient) => {
        console.log("Daily Activity");
        for (var guild of await client.guilds.fetch()) {
            var voiceStates = await client.db.repos.activityVoicestates.findBy({ guildId: guild[0] });
            voiceStates.forEach(async (userVoiceState) => {
                var secondsSinceLastUpdate = (new Date().getTime() - userVoiceState.joinedAt.getTime()) / 1000;
                updateVoiceState(client, guild[0], userVoiceState.userId, userVoiceState.channelId);
                await saveVoice(client, guild[0], userVoiceState.userId, secondsSinceLastUpdate);
                client.db.repos.activityVoice.save({
                    guildId: guild[0],
                    userId: userVoiceState.userId,
                    dailySeconds: 0
                })
            });
        }
    }
}
