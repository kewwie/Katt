import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("guild_config")
export class GuildConfigEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id", type: "bigint" })
    guildId: string;

    @Column({ name: "guest_role", type: "bigint" })
    guestRole: string;

    @Column({ name: "member_role", type: "bigint" })
    memberRole: string;

    @Column({ name: "admin_role", type: "bigint" })
    adminRole: string;

    @Column({ name: "log_channel", type: "bigint" })
    logChannel: string;

    @Column({ name: "pending_channel", type: "bigint" })
    pendingChannel: string;

    @Column({ name: "verification_ping", type: "bigint" })
    verificationPing: string;

    @Column({ name: "welcome_channel", type: "bigint" })
    welcomeChannel: string;

    @Column({ name: "welcome_message", type: "text" })
    welcomeMessage: string;

    @Column({ name: "custom_category", type: "bigint" })
    customCategory: string;

    @Column({ name: "custom_channel", type: "bigint" })
    customChannel: string;
}