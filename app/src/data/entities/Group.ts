import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("groups")
export class Group {
    @PrimaryColumn({ type: "varchar", length: 255 })
    groupId: string;;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255 })
    guildId: string;

    @Column({ type: "varchar", length: 255 })
    roleId: string;

    @Column({ type: "varchar", length: 255 })
    ownerId: string;
    
    @Column({ type: "boolean", default: false })
    private: boolean;
}