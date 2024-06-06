import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'guild_plugins' })
export class GuildPluginEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string;

    @Column({ name: "plugin_name", type: 'varchar' })
    pluginName: string;
}