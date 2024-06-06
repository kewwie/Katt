import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "group_invites" })
export class GroupInviteEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "group_id", type: 'bigint' })
    groupId: string;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string;

    @Column({ name: "inviter_id", type: 'bigint' })
    inviterId: string;

    @Column({ name: "message_id", type: 'bigint' })
    messageId: string;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: Date;
}