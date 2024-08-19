import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity('group_members')
export class GroupMemberEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "group_id", type: 'bigint' })
    groupId: string | null = null;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string | null = null;

    @Column({ name: "user_name", type: 'varchar' })
    userName: string | null = null;
}