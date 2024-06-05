import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user_levels" })
export class UserLevel {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id", type: "varchar"})
    guildId: string;

    @Column({ name: "user_id", type: "varchar"})
    userId: string;

    @Column({ name: "level", type: "int"})
    level: number;

    @Column({ name: "xp", type: "int"})
    xp: number;

    @Column({ name: "user_xp", type: "int"})
    userXp: number;

    @Column({ name: "level_xp", type: "int"})
    levelXp: number;

    @Column({ name: "updated_at", type: "datetime" })
    updatedAt: Date;
}