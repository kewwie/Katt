import { MigrationInterface, QueryRunner } from "typeorm";

export class EditMinutesToSeconds1716311494434 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE voiceActivity RENAME COLUMN minutes TO seconds");
        await queryRunner.query("UPDATE voiceActivity SET seconds = seconds * 60");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE voiceActivity RENAME COLUMN seconds TO minutes");
        await queryRunner.query("UPDATE voiceActivity SET minutes = minutes / 60");
    }

}
