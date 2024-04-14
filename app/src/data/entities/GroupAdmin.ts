import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';

import { Group } from './Group';

@Entity('groupAdmins')
export class GroupAdmin {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    groupId: string;

    @Column({ type: 'varchar', length: 255 })
    userId: string;

    @ManyToOne(() => Group, group => group.members)
    group: Group;
}