import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "group_invites" })
export class GroupInvite {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    group_id: string;

    @Column({ type: "varchar", length: 255 })
    user_id: string;

    @Column({ type: "varchar", length: 255 })
    inviter_id: string;

    @Column({ type: "varchar", length: 255 })
    message_id: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
}