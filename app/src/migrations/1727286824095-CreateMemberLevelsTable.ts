import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMemberLevelsTable1727286824095 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE member_levels (
                _id         INT(10) UNSIGNED    NOT NULL AUTO_INCREMENT,
                guild_id    BIGINT(20) UNSIGNED NOT NULL,
                user_id     BIGINT(20) UNSIGNED NOT NULL,
                level       INT(5) UNSIGNED     NOT NULL DEFAULT 0,
                PRIMARY KEY (_id),
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE member_levels;
        `);
    }

}
