import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity("auth_users")
export class AuthUser {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    userId: string; 

    @Column({ type: 'varchar', length: 255, name: 'token_type' })
    tokenType: string;

    @Column({ type: 'varchar', length: 255, name: 'access_token' })
    accessToken: string;

    @Column({ type: 'datetime' })
    expires: Date;

    @Column({ type: 'varchar', length: 255, name: 'refresh_token' })
    refreshToken: string;

    @Column({ type: 'varchar', length: 255 })
    username: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    discriminator: string;

    @Column({ type: 'varchar', length: 255 })
    tag: string;

    @Column({ type: 'varchar', length: 255 })
    avatarUrl: string;
}