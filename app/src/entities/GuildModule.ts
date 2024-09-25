import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("guild_modules")
export class GuildModuleEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string;

    @Column({ name: "module_id", type: 'varchar' })
    moduleId: string;
}