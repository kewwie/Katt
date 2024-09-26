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
    execute: (client: KiwiClient) => {
        console.log("Weekly Activity");
    }
}
