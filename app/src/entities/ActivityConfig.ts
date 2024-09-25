import { Entity, Column, ObjectIdColumn } from "typeorm";

@Entity("activity_config")
export class ActivityConfigEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string;

    @Column({ name: "log_channel", type: 'bigint' })
    logChannel: string;

    @Column({ name: "most_active_role", type: 'boolean' })
    mostActiveRole: boolean;
}