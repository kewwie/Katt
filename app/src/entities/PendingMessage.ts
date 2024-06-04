import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "pending_messages" })
export class PendingMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    guild_id: string;

    @Column({ type: "varchar" })
    user_id: string;

    @Column({ type: "varchar" })
    message_id: string;
}