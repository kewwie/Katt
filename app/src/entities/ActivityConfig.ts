import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("activity_config")
export class ActivityConfigEntity {
    @PrimaryColumn({ name: "guild_id" })
    guildId: string;

    @Column({ name: "log_channel" })
    logChannel: string;

    @Column({ name: "most_active_role" })
    mostActiveRole: string;

    @Column({ name: "daily_most_active_role" })
    dailyMostActiveRole: string;

    @Column({ name: "weekly_most_active_role" })
    weeklyMostActiveRole: string;

    @Column({ name: "monthly_most_active_role" })
    monthlyMostActiveRole: string;
}