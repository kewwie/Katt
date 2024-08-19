import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'guild_users' })
export class GuildUserEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string | null = null;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string | null = null;

    @Column({ name: "user_name", type: 'varchar' })
    userName: string | null = null;

    @Column({ name: "level", type: 'int' })
    level: number | null = null;
}