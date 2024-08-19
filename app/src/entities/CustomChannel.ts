import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity("custom_channels")
export class CustomChannelEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string | null = null;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string | null = null;

    @Column({ name: "channel_id", type: 'bigint' })
    channelId: string | null = null;

    @Column({ name: "channel_name", type: 'varchar' })
    channelName: string | null = null;
}