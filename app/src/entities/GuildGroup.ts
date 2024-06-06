import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("guild_groups")
export class GuildGroupEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string;

    @Column({ name: "role_id", type: 'bigint' })
    roleId: string;

    @Column({ name: "owner_id", type: 'bigint' })
    ownerId: string;

    @Column({ name: "group_id", type: 'bigint' })
    groupId: string;

    @Column({ name: "group_name", type: 'varchar' })
    groupName: string;
    
    @Column({ name: "private", type: 'boolean' })
    private: boolean;
}