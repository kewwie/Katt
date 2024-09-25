import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("member_levels")
export class MemberLevelEntity {
    @PrimaryColumn({ name: "guild_id", type: 'bigint' })
    guildId: string;

    @PrimaryColumn({ name: "user_id", type: 'bigint' })
    userId: string;

    @Column({ name: "level", type: 'int' })
    level: number;
}