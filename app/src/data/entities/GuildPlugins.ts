import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'guild_plugins' })
export class GuildPlugins {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar' })
    guild_id: string;

    @Column({ type: 'varchar' })
    plugin: string;

    @Column({ type: 'boolean', default: false })
    status: boolean;
}