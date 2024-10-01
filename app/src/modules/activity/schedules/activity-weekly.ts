import { RecurrenceRule } from "node-schedule";
import { Schedule } from "../../../types/schedule";
import { KiwiClient } from "../../../client";

var timeRule = new RecurrenceRule();
timeRule.tz = 'UTC';
timeRule.minute = 0;
timeRule.hour = 0;
timeRule.dayOfWeek = 1;

export const ActivityWeeklySchedule: Schedule = {
    rule: timeRule,
    execute: async (client: KiwiClient, guildId: string) => {
        console.log("Weekly Activity");
        client.db.repos.activityVoice.update({
            guildId: guildId
        }, {
            weeklySeconds: 0
        })
    }
}
