import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("list_config")
export class ListConfigEntity {
    @PrimaryColumn({ name: "guild_id" })
    guildId: string;

    @Column({ name: "log_channel", nullable: true })
    logChannel: string;
}