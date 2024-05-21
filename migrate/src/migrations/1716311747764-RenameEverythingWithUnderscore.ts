import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameEverythingWithUnderscore1716311747764 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE voiceActivity RENAME TO voice_activity");
        await queryRunner.query("ALTER TABLE voiceChannels RENAME TO voice_channels");
        await queryRunner.query("ALTER TABLE groupMembers RENAME TO group_members");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE voice_activity RENAME TO voiceActivity");
        await queryRunner.query("ALTER TABLE voice_channels RENAME TO voiceChannels");
        await queryRunner.query("ALTER TABLE group_members RENAME TO groupMembers");
    }

}
