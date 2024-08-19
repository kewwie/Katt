import { Entity, Column, ObjectIdColumn } from "typeorm";

@Entity("pending_messages")
export class PendingMessageEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string | null = null;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string | null = null;

    @Column({ name: "message_id", type: 'bigint' })
    messageId: string | null = null;
}