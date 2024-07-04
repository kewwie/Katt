import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("user_verified")
export class UserVerifiedEntity {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ name: "guild_id", type: "bigint" })
    guildId: string;

    @Column({ name: "user_id", type: "bigint" })
    userId: string;

    @Column({ name: "user_name", type: "varchar" })
    userName: string;

    @Column({ name: "mod_id", type: "bigint" })
    modId: string;

    @Column({ name: "mod_name", type: "varchar" })
    modName: string;
}