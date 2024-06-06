import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateGroupTables1713112195527 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "guild_groups",
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
                        name: "role_id",
                        type: "bigint",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "owner_id",
                        type: "bigint",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "group_id",
                        type: "bigint",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "group_name",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: 'private',
                        type: 'boolean',
                        default: false,
                        isNullable: false
                    }
                ]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "group_members",
                columns: [
                    {
                        name: "_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "group_id",
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
                    }
                ]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "group_invites",
                columns: [
                    {
                        name: "_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "group_id",
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
                        name: "inviter_id",
                        type: "bigint",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "message_id",
                        type: "bigint",
                        unsigned: true,
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        isNullable: false
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("guild_groups");
        await queryRunner.dropTable("group_members");
        await queryRunner.dropTable("group_invites");
    }
}