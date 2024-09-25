import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGuildModulesTable1727287303779 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE guild_modules (
                _id         INT(10) UNSIGNED    NOT NULL AUTO_INCREMENT,
                guild_id    BIGINT(20) UNSIGNED NOT NULL,
                module_id   INT(10) UNSIGNED    NOT NULL,
                PRIMARY KEY (_id),
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE guild_modules;
        `);
    }

}
