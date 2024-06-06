import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomVoiceToGuilds1717629894934 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE guilds ADD COLUMN voice_category BIGINT NULL`);
        await queryRunner.query(`ALTER TABLE guilds ADD COLUMN voice_channel BIGINT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE guilds DROP COLUMN voice_category`);
        await queryRunner.query(`ALTER TABLE guilds DROP COLUMN voice_channel`);
    }

}
