import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("member_levels")
export class MemberLevelEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string;

    @Column({ name: "level", type: 'int' })
    level: number;
}