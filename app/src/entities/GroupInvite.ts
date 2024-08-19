import { Entity, Column, ObjectIdColumn } from "typeorm";

@Entity({ name: "group_invites" })
export class GroupInviteEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "group_id", type: 'bigint' })
    groupId: string | null = null;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string | null = null;

    @Column({ name: "inviter_id", type: 'bigint' })
    inviterId: string | null = null;

    @Column({ name: "message_id", type: 'bigint' })
    messageId: string | null = null;

    @Column({ name: "created_at", type: "timestamp" })
    createdAt: Date | null = null;
}