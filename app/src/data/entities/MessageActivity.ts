import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'message_activity' })
export class MessageActivity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    guildId: string;

    @Column({ type: 'varchar', length: 255 })
    userId: string;

    @Column({ type: 'varchar', length: 255 })
    username: string;

    @Column({ type: 'int', nullable: false, default: 0 })
    messages: number;
}