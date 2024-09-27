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
            for (var guild of await this.client.guilds.fetch()) {
                if (guild[0] && schedule.module && !schedule.module?.default) {
                    let isEnabled = await this.client.db.repos.guildModules
                        .findOneBy({ guildId: guild[0], moduleId: schedule.module.id });
                    if (isEnabled) {
                        schedule.execute(this.client, guild[0]);
                    }
                }
            }
        });        
    }
};