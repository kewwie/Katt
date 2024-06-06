import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("voice_states")
export class VoiceStateEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string;

    @Column({ name: "join_time", type: 'datetime' })
    joinTime: Date;
}