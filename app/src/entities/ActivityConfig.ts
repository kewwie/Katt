import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("activity_config")
export class ActivityConfigEntity {
    @PrimaryColumn({ name: "guild_id" })
    guildId: string;

    @Column({ name: "log_channel" })
    logChannel: string;

    @Column({ name: "most_active_role" })
    mostActiveRole: string;
}