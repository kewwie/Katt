import { Entity, Column, ObjectIdColumn } from "typeorm";

@Entity("guild_modules")
export class GuildModuleEntity {
    @ObjectIdColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string;

    @Column({ name: "module_id", type: 'varchar' })
    moduleId: string;
}