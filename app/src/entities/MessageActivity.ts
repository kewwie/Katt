import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'message_activity' })
export class MessageActivityEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id", type: "bigint" })
    guildId: string;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string;

    @Column({ name: "user_name", type: 'varchar' })
    userName: string;

    @Column({ name: "amount", type: 'int' })
    amount: number;
}