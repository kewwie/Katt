import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('groupAdmins')
export class GroupAdmin {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    groupId: string;

    @Column({ type: 'varchar', length: 255 })
    userId: string;

    @Column({ type: 'varchar', length: 255 })
    username: string;
}