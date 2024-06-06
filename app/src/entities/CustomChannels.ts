import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'custom_channels' })
export class CustomChannels {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string;

    @Column({ name: "channel_id", type: 'bigint' })
    channelId: string;

    @Column({ name: "name", type: 'varchar' })
    name: string;
}