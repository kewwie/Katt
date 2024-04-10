import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: 'guilds' })
export class Guild {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    guildId: string; // Guild ID

    @Column({ type: 'varchar', length: 255, nullable: true })
    guestRole: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    memberRole: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    logsChannel: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    pendingChannel: string | null;
}