import { RecurrenceRule } from "node-schedule";
import { Schedule } from "../types/schedule";
import { KiwiClient } from "../client";

var timeRule = new RecurrenceRule();
timeRule.tz = 'CST';
timeRule.minute = 0;
timeRule.hour = 0;
timeRule.dayOfWeek = 1;

export const ActivityWeeklySchedule: Schedule = {
    rule: timeRule,
    execute: async (client: KiwiClient, guildId: string) => {
        console.log("Weekly Activity");
        var voiceStates = await client.db.repos.activityVoicestates.findBy({ guildId: guildId });
        voiceStates.forEach(async (userVoiceState) => {
            client.db.repos.activityVoice.save({
                guildId: guildId,
                userId: userVoiceState.userId,
                weeklySeconds: 0
            })
        });
    }
}
