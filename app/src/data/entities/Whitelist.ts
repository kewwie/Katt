import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "whitelist" })
export class Whitelist {
    @PrimaryColumn({ type: "varchar", length: 255, unique: true })
    userId: string;

    @Column({ type: "varchar", length: 255 })
    guildId: string;

    @Column({ type: "varchar", length: 255 })
    username: string;

    @Column({ type: "varchar", length: 255 })
    level: string;

    @Column({ type: "varchar", length: 255 })
    createdBy: string;
}