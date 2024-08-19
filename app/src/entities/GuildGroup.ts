import { Entity, Column, ObjectIdColumn } from "typeorm";

@Entity("guild_groups")
export class GuildGroupEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string | null = null;

    @Column({ name: "role_id", type: 'bigint' })
    roleId: string | null = null;

    @Column({ name: "owner_id", type: 'bigint' })
    ownerId: string | null = null;

    @Column({ name: "group_id", type: 'bigint' })
    groupId: string | null = null;

    @Column({ name: "group_name", type: 'varchar' })
    groupName: string | null = null;
    
    @Column({ name: "private", type: 'boolean' })
    private: boolean | null = null;
}