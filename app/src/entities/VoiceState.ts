import { Entity, Column, ObjectIdColumn } from "typeorm";

@Entity("voice_states")
export class VoiceStateEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string | null = null;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string | null = null;

    @Column({ name: "join_time", type: 'datetime' })
    joinTime: Date | null = null;
}