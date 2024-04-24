import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerificationPing1713421952345 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE guilds ADD COLUMN verificationPing VARCHAR(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE guilds DROP COLUMN verificationPing`);
    }

}
