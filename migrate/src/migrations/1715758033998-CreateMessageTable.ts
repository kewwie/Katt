import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMessageTable1715758033998 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "message_activity",
                columns: [
                    {
                        name: "_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "guild_id",
                        type: "bigint",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "user_id",
                        type: "bigint",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "user_name",
                        type: "varchar",
                        length: "32",
                        isNullable: false
                    },
                    {
                        name: "amount",
                        type: "int",
                        unsigned: true,
                        isNullable: false,
                        default: 0
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("message_activity");
    }
}