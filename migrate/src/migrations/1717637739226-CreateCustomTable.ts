import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCustomTable1717637739226 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "custom_channels",
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
                        name: "channel_id",
                        type: "bigint",
                        unsigned: true,
                        isNullable: true
                    },
                    {
                        name: "channel_name",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("custom_channels");
    }

}
