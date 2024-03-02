import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Nicknames1709393783931 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "nicknames",
                columns: [
                    {
                        name: "userId",
                        type: "bigint",
                        unsigned: true,
                        isPrimary: true,
                    },
                    {
                        name: "guildId",
                        type: "bigint"
                    },
                    {
                        name: "nickname",
                        type: "varchar",
                        length: "50"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("nicknames");
    }

}
