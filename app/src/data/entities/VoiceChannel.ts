import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: 'voiceChannels' })
export class VoiceChannel {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    guildId: string;

    @Column({ type: 'varchar', length: 255 })
    userId: string;

    @Column({ type: 'datetime' })
    joinTime: Date;
}