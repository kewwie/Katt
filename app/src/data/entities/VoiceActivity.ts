import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'voiceActivity' })
export class VoiceActivity {
    @PrimaryColumn({ type: 'varchar', unique: true })
    guildId: string;

    @Column({ type: 'varchar' })
    userId: string;

    @Column({ type: 'int', nullable: false, default: 0 })
    minutes: number;
}