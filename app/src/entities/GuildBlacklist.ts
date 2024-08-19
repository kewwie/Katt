import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity({ name: 'guild_blacklist' })
export class GuildBlacklistEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'varchar' })
    guildId: string | null = null;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string | null = null;

    @Column({ name: "user_name", type: 'varchar' })
    userName: string | null = null;

    @Column({ name: "mod_id", type: 'bigint' })
    modId: string | null = null;

    @Column({ name: "mod_name", type: 'varchar' })
    modName: string | null = null;
}