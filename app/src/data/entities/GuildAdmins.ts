import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'guild_admins' })
export class GuildAdmins {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    guildId: string;

    @Column({ type: 'varchar' })
    userId: string;

    @Column({ type: 'int', default: 1 })
    level: number;
}