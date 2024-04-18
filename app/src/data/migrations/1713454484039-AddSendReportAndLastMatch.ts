import { MigrationInterface, QueryRunner, } from "typeorm";

export class AddSendReportAndLastMatch1713454484039 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE valorant_users ADD COLUMN send_report BOOLEAN`);
        await queryRunner.query(`ALTER TABLE valorant_users ADD COLUMN last_match VARCHAR(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE valorant_users DROP COLUMN send_report`);
        await queryRunner.query(`ALTER TABLE valorant_users DROP COLUMN last_match`);
    }

}
