import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVanityToGuilds1715021230579 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE guilds ADD COLUMN vanity VARCHAR(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE guilds DROP COLUMN vanity`);
    }

}
