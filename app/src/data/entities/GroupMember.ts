import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';

import { Group } from './Group';

@Entity('groupMembers')
export class GroupMember {
    @PrimaryColumn({ type: 'varchar' })
    groupId: string;

    @Column({ type: 'varchar' })
    userId: string;

    @Column({ type: 'varchar' })
    username: string;

    @ManyToOne(() => Group, group => group.members)
    group: Group;
}