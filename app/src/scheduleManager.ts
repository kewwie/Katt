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
            console.log("Gonna check here if the module is enavled or not...");
            schedule.execute(this.client);
        });        
    }
};