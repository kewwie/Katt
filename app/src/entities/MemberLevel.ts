import { Entity, ObjectIdColumn, Column } from "typeorm";

@Entity("member_levels")
export class MemberLevelEntity {
    @ObjectIdColumn()
    _id: number;

    @Column()
    guildId: string;

    @Column()
    userId: string;

    @Column()
    level: number;
}