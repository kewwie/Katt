import { MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateDefaultTables1712735349383 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "guild_config",
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
                        name: "level_one",
                        type: "bigint",
                        unsigned: true,
                        isNullable: true
                    },
                    {
                        name: "level_two",
                        type: "bigint",
                        unsigned: true,
                        isNullable: true
                    },
                    {
                        name: "level_three",
                        type: "bigint",
                        unsigned: true,
                        isNullable: true
                    },
                    {
                        name: "level_four",
                        type: "bigint",
                        unsigned: true,
                        isNullable: true
                    },
                    {
                        name: "level_five",
                        type: "bigint",
                        unsigned: true,
                        isNullable: true
                    },
                    {
                        name: "log_channel",
                        type: "bigint",
                        unsigned: true,
                        isNullable: true
                    },
                    {
                        name: "pending_channel",
                        type: "bigint",
                        unsigned: true,
                        isNullable: true
                    },
                    {
                        name: "verification_ping",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "welcome_channel",
                        type: "bigint",
                        unsigned: true,
                        isNullable: true
                    },
                    {
                        name: "welcome_message",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "custom_channel",
                        type: "bigint",
                        unsigned: true,
                        isNullable: true
                    },
                    {
                        name: "custom_category",
                        type: "bigint",
                        unsigned: true,
                        isNullable: true
                    }
                ]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "guild_users",
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
                        name: "level",
                        type: "int",
                        unsigned: true,
                        isNullable: false
                    }
                ]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "guild_plugins",
                columns: [
                    {
                        name: "_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "guild_id",
                        type: "bigint",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "plugin_name",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    }
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("guild_config");
        await queryRunner.dropTable("guild_admins");
        await queryRunner.dropTable("guild_plugins");
    }
}