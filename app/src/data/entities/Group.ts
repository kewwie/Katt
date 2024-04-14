import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToMany } from "typeorm";

import { GroupAdmin } from "./GroupAdmin";
import { GroupMember } from "./GroupMember";

@Entity("groups")
export class Group {
    @PrimaryColumn({ type: "varchar", length: 255 })
    groupId: string;;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255 })
    guildId: string;

    @Column({ type: "varchar", length: 255 })
    roleId: string;

    @Column({ type: "varchar", length: 255 })
    ownerId: string;

    @OneToMany(() => GroupAdmin, groupAdmin => groupAdmin.userId)
    admins: GroupMember[];

    @OneToMany(() => GroupMember, groupMember => groupMember.userId)
    members: GroupMember[];
    
    @Column({ type: "boolean", default: false })
    private: boolean;
}