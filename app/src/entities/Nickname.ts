import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "nicknames" })
export class Nickname {
    @PrimaryColumn({ type: "varchar" })
    userId: string;

    @Column({ type: "varchar" })
    guildId: string;

    @Column({ type: "varchar" })
    nickname: string;
}