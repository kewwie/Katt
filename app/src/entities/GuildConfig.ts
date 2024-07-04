import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("guild_config")
export class GuildConfigEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id", type: "bigint" })
    guildId: string;

    @Column({ name: "level_one", type: "bigint" })
    levelOne: string;

    @Column({ name: "level_two", type: "bigint" })
    levelTwo: string;

    @Column({ name: "level_three", type: "bigint" })
    levelThree: string;

    @Column({ name: "level_four", type: "bigint" })
    levelFour: string;

    @Column({ name: "level_five", type: "bigint" })
    levelFive: string;

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