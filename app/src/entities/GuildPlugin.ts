import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'guild_plugins' })
export class GuildPluginEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string | null = null;

    @Column({ name: "plugin_name", type: 'varchar' })
    pluginName: string | null = null;
}