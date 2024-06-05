import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user_levels" })
export class UserLevels {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column("guild_id")
    guildId: bigint;

    @Column("user_id")
    userId: bigint;

    @Column("level")
    level: number;

    @Column("xp")
    xp: number;

    @Column("last_updated")
    last_updated: Date;
}