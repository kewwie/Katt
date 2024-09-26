import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("member_levels")
export class MemberLevelEntity {
    @PrimaryColumn({ name: "guild_id" })
    guildId: string;

    @PrimaryColumn({ name: "user_id" })
    userId: string;

    @Column({ name: "level" })
    level: number;
}