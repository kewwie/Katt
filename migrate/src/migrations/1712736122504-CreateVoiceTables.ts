import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVoiceTables1712736122504 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "voice_states",
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
                        name: "join_time",
                        type: "datetime",
                        isNullable: false
                    }
                ]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "voice_activity",
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
                        name: "seconds",
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
        await queryRunner.dropTable("voice_states");
        await queryRunner.dropTable("voice_activity");
    }
}