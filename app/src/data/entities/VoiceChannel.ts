import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'voice_channels' })
export class VoiceChannel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    guildId: string;

    @Column({ type: 'varchar', length: 255 })
    userId: string;

    @Column({ type: 'datetime' })
    joinTime: Date;
}