import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("list_config")
export class ListConfigEntity {
    @PrimaryColumn({ name: "guild_id", type: 'bigint' })
    guildId: string;

    @Column({ name: "log_channel", type: 'bigint', nullable: true })
    logChannel: string;
}