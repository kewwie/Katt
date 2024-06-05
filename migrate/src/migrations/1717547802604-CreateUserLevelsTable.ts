import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserLevelsTable1717547802604 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "user_levels",
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
                    },
                    {
                        name: "user_id",
                        type: "bigint",
                    },
                    {
                        name: "level",
                        type: "int",
                        unsigned: true,
                        isNullable: false,
                        default: 0
                    },
                    {
                        name: "xp",
                        type: "int",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "user_xp",
                        type: "int",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "level_xp",
                        type: "int",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "updated_at",
                        type: "datetime",
                        isNullable: false,
                        default: "CURRENT_TIMESTAMP"
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user_levels");
    }

}
