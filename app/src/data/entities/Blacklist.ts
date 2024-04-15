import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "blacklist" })
export class Blacklist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    guildId: string;

    @Column({ type: "varchar" })
    userId: string;

    @Column({ type: "varchar" })
    username: string;

    @Column({ type: "varchar" })
    createdBy: string;
}