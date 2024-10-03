import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateActivityTables1727286580382 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'activity_config',
                columns: [
                    {
                        name: 'guild_id',
                        type: 'bigint',
                        isPrimary: true,
                        isNullable: false,
                        unsigned: true
                    },
                    {
                        name: 'log_channel',
                        type: 'bigint',
                        isNullable: true,
                        unsigned: true,
                        default: null
                    },
                    {
                        name: 'daily_active_role',
                        type: 'bigint',
                        isNullable: true,
                        unsigned: true,
                        default: null
                    },
                    {
                        name: 'weekly_active_role',
                        type: 'bigint',
                        isNullable: true,
                        unsigned: true,
                        default: null
                    }
                ]
            }), true
        );

        await queryRunner.createTable(
            new Table({
                name: 'activity_voicestates',
                columns: [
                    {
                        name: 'guild_id',
                        type: 'bigint',
                        isPrimary: true,
                        isNullable: false,
                        unsigned: true
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isPrimary: true,
                        isNullable: false,
                        unsigned: true
                    },
                    {
                        name: 'channel_id',
                        type: 'bigint',
                        isNullable: false,
                        unsigned: true
                    },
                    {
                        name: 'joined_at',
                        type: 'datetime',
                        isNullable: false,
                        default: "CURRENT_TIMESTAMP"
                    }
                ]
            }), true
        );

        await queryRunner.createTable(
            new Table({
                name: 'activity_voice',
                columns: [
                    {
                        name: 'guild_id',
                        type: 'bigint',
                        isPrimary: true,
                        isNullable: false,
                        unsigned: true
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isPrimary: true,
                        isNullable: false,
                        unsigned: true
                    },
                    {
                        name: "user_name",
                        type: "varchar",
                        length: "32",
                        isNullable: false
                    },
                    {
                        name: "total_seconds",
                        type: "int",
                        isNullable: false,
                        default: 0
                    },
                    {
                        name: "daily_seconds",
                        type: "int",
                        isNullable: false,
                        default: 0
                    },
                    {
                        name: "weekly_seconds",
                        type: "int",
                        isNullable: false,
                        default: 0
                    },
                    {
                        name: "monthly_seconds",
                        type: "int",
                        isNullable: false,
                        default: 0
                    },
                    {
                        name: "last_update",
                        type: "datetime",
                        isNullable: false,
                        default: "CURRENT_TIMESTAMP"
                    }
                ]
            }), true
        );

        await queryRunner.createTable(
            new Table({
                name: 'activity_messages',
                columns: [
                    {
                        name: 'guild_id',
                        type: 'bigint',
                        isPrimary: true,
                        isNullable: false,
                        unsigned: true
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isPrimary: true,
                        isNullable: false,
                        unsigned: true
                    },
                    {
                        name: "total_messages",
                        type: "int",
                        isNullable: false,
                        default: 0
                    },
                    {
                        name: "daily_messages",
                        type: "int",
                        isNullable: false,
                        default: 0
                    },
                    {
                        name: "weekly_messages",
                        type: "int",
                        isNullable: false,
                        default: 0
                    },
                    {
                        name: "monthly_messages",
                        type: "int",
                        isNullable: false,
                        default: 0
                    },
                    {
                        name: "last_update",
                        type: "datetime",
                        isNullable: false,
                        default: "CURRENT_TIMESTAMP"
                    }
                ]
            }), true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('activity_config');
        await queryRunner.dropTable('activity_voice');
        await queryRunner.dropTable('activity_voicestates');
        await queryRunner.dropTable('activity_messages');
    }
}
