import { Entity, Column, ObjectIdColumn } from "typeorm";

@Entity("guild_config")
export class GuildConfigEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "guild_id", type: "bigint" })
    guildId: string | null = null;
}