import { scheduleJob } from "node-schedule";
import { KiwiClient } from "./client";
import { Schedule } from "./types/schedule";

export class ScheduleManager {
    private client: KiwiClient;

    constructor(client: KiwiClient) {
        this.client = client;
    }

    register(schedule: Schedule) {
        scheduleJob(schedule.rule, async () => {
            console.log("ScheduleManager is running...");
            schedule.execute(this.client);
        });        
    }
};