import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("activity_config")
export class ActivityConfigEntity {
    @PrimaryColumn({ name: "guild_id" })
    guildId: string;

    @Column({ name: "log_channel" })
    logChannel: string;

    @Column({ name: "daily_active_role" })
    dailyActiveRole: string;

    @Column({ name: "weekly_active_role" })
    weeklyActiveRole: string;
}