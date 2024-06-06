import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateNicknameTable1713199308575 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "nicknames",
                columns: [
                    {
                        name: "_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "user_id",
                        type: "bigint",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "guild_id",
                        type: "bigint",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "32",
                        isNullable: false
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("nicknames");
    }
}