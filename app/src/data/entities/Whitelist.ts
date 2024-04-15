import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "whitelist" })
export class Whitelist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    guildId: string;
    
    @Column({ type: "varchar", length: 255 })
    userId: string;

    @Column({ type: "varchar", length: 255 })
    username: string;

    @Column({ type: "varchar", length: 255 })
    level: string;

    @Column({ type: "varchar", length: 255 })
    createdBy: string;
}