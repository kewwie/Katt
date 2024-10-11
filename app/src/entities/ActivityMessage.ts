import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('activity_messages')
export class ActivityMessageEntity {
    @PrimaryColumn({ name: "guild_id", type: 'bigint', unsigned: true })
    guildId: string;

    @PrimaryColumn({ name: "user_id", type: 'bigint', unsigned: true })
    userId: string;

    @Column({ name: "user_name", type: 'varchar', length: 32 })
    userName: string;

    @Column({ name: "total_messages", type: 'int', default: 0 })
    totalMessages: number;

    @Column({ name: "daily_messages", type: 'int', default: 0 })
    dailyMessages: number;

    @Column({ name: "weekly_messages", type: 'int', default: 0 })
    weeklyMessages: number;

    @Column({ name: "monthly_messages", type: 'int', default: 0 })
    monthlyMessages: number;

    @UpdateDateColumn({ name: "last_update" })
    lastUpdate: Date;
}