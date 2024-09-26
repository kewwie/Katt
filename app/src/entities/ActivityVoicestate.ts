import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('activity_voicestates')
export class ActivityVoicestateEntity {
    @PrimaryColumn({ name: "guild_id" })
    guildId: string;

    @PrimaryColumn({ name: "user_id" })
    userId: string;

    @Column({ name: "channel_id" })
    channelId: string;

    @Column({ name: "joined_at" })
    joinedAt: Date;
}