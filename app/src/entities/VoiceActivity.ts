import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity("voice_activity")
export class VoiceActivityEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string | null = null;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string | null = null;

    @Column({ name: "user_name", type: 'varchar' })
    userName: string | null = null;

    @Column({ name: "seconds", type: 'int' })
    seconds: number | null = 0;
}