import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: 'guilds' })
export class GuildConfig {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    guildId: string; // Guild ID

    @Column({ type: 'varchar', length: 255, nullable: true })
    verificationPing: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    guestRole: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    memberRole: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    adminRole: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    logsChannel: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    pendingChannel: string | null;

    @Column({ name: "voice_category", type: "bigint" })
    voiceCategory: string;

    @Column({ name: "voice_channel", type: "bigint" })
    voiceChannel: string;
}