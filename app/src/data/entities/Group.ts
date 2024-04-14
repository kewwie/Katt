import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToMany } from "typeorm";

import { GroupMember } from "./GroupMember";

@Entity("groups")
export class Group {
    @PrimaryColumn()
    groupId: string;

    @Column()
    name: string;

    @Column()
    guildId: string;

    @Column()
    roleId: string;

    @Column()
    ownerId: string;

    @OneToMany(() => GroupMember, groupMember => groupMember.groupId)
    members: GroupMember[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}