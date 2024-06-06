import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("nicknames")
export class NicknameEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id", type: 'bigint' })
    guildId: string;

    @Column({ name: "user_id", type: 'bigint' })
    userId: string;

    @Column({ name: "name", type: 'varchar' })
    name: string;
}