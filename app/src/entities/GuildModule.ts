import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("guild_modules")
export class GuildModuleEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id" })
    guildId: string;

    @Column({ name: "module_id" })
    moduleId: string;
}