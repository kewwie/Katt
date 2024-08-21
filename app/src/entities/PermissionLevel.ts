import { Entity, ObjectIdColumn, Column } from "typeorm";

@Entity("premission_levels")
export class PermissionLevelEntity {
    @ObjectIdColumn()
    _id: number;

    @Column()
    guildId: string;

    @Column()
    userId: string;

    @Column()
    level: number;
}