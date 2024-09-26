import { RecurrenceRule } from "node-schedule";
import { Schedule } from "../types/schedule";

var timeRule = new RecurrenceRule();
timeRule.tz = 'CST';
timeRule.minute = 0;
timeRule.hour = 0;
timeRule.date = 1;

export const ActivityMonthlySchedule: Schedule = {
    rule: timeRule,
    execute: (client: any) => {
        console.log("Monthly Activity");
    }
}
