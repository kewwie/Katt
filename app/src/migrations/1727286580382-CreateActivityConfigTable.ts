import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateActivityConfigTable1727286580382 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE activity_config (
                _id                 INT(10) UNSIGNED    NOT NULL AUTO_INCREMENT,
                guild_id            BIGINT(20) UNSIGNED NOT NULL,
                log_channel         BIGINT(20) UNSIGNED NULL     DEFAULT NULL,
                most_active_role    BIGINT(20) UNSIGNED NULL     DEFAULT NULL,
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE activity_config;
        `);
    }

}
