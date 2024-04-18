import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "valorant_users" })
export class ValorantUser {
    @PrimaryColumn({ type: "varchar", length: 255 })
    userId: string;

    @Column({ type: "varchar", length: 255 })
    puuid: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255 })
    tag: string;

    @Column({ type: "varchar", length: 255 })
    region: string;

    @Column({ type: "boolean" })
    send_report: boolean;

    @Column({ type: "varchar", length: 255 })
    last_match: string;
}