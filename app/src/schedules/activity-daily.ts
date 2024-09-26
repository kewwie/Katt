import { RecurrenceRule } from "node-schedule";
import { Schedule } from "../types/schedule";
import { KiwiClient } from "../client";

var timeRule = new RecurrenceRule();
timeRule.tz = 'CST';
timeRule.hour = 0;
timeRule.minute = 0

export const ActivityDailySchedule: Schedule = {
    rule: timeRule,
    execute: (client: KiwiClient) => {
        console.log("Daily Activity");
    }
}
