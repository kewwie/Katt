import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('activity_voice')
export class ActivityVoiceEntity {
    @PrimaryColumn({ name: "guild_id" })
    guildId: string;

    @PrimaryColumn({ name: "user_id" })
    userId: string;

    @Column({ name: "total_seconds" })
    totalSeconds: number;

    @Column({ name: "daily_seconds" })
    dailySeconds: number;

    @Column({ name: "weekly_seconds" })
    weeklySeconds: number;

    @Column({ name: "monthly_seconds" })
    monthlySeconds: number;

    @UpdateDateColumn({ name: "last_update" })
    lastUpdate: Date;
}