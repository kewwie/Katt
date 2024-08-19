import { Entity, Column, ObjectIdColumn } from "typeorm";

@Entity("guild_config")
export class GuildConfigEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "guild_id", type: "bigint" })
    guildId: string | null = null;

    @Column({ name: "level_one", type: "bigint" })
    levelOne: string | null = null;

    @Column({ name: "level_two", type: "bigint" })
    levelTwo: string | null = null;

    @Column({ name: "level_three", type: "bigint" })
    levelThree: string | null = null;

    @Column({ name: "level_four", type: "bigint" })
    levelFour: string | null = null;

    @Column({ name: "level_five", type: "bigint" })
    levelFive: string | null = null;

    @Column({ name: "log_channel", type: "bigint" })
    logChannel: string | null = null;

    @Column({ name: "pending_channel", type: "bigint" })
    pendingChannel: string | null = null;

    @Column({ name: "verification_ping", type: "bigint" })
    verificationPing: string | null = null;

    @Column({ name: "welcome_channel", type: "bigint" })
    welcomeChannel: string | null = null;

    @Column({ name: "welcome_message", type: "text" })
    welcomeMessage: string | null = null;

    @Column({ name: "custom_category", type: "bigint" })
    customCategory: string | null = null;

    @Column({ name: "custom_channel", type: "bigint" })
    customChannel: string | null = null;
}