import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('group_members')
export class GroupMemberEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "group_id", type: 'bigint' })
    groupId: string;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string;

    @Column({ name: "user_name", type: 'varchar' })
    userName: string;
}