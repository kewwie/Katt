import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("custom_channels")
export class CustomChannelEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string;

    @Column({ name: "channel_id", type: 'bigint' })
    channelId: string;

    @Column({ name: "channel_name", type: 'varchar' })
    channelName: string;
}