import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVerificationTables1716586529067 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "user_verified",
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
                        name: "mod_id",
                        type: "bigint",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "mod_name",
                        type: "varchar",
                        length: "32",
                        isNullable: false
                    },
                ]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "pending_messages",
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
                        name: "message_id",
                        type: "bigint",
                        unsigned: true,
                        isNullable: false
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user_verified");
        await queryRunner.dropTable("pending_messages");
    }
}