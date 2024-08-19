import { Entity, Column, ObjectIdColumn } from "typeorm";

@Entity("nicknames")
export class NicknameEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string | null = null;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string | null = null;

    @Column({ name: "name", type: 'varchar' })
    name: string | null = null;
}