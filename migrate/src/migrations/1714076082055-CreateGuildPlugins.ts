import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateGuildPlugins1714076082055 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "guild_plugins",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "guild_id",
                        type: "varchar",
                    },
                    {
                        name: "plugin",
                        type: "varchar",
                    },
                    {
                        name: "status",
                        type: "boolean",
                        default: false
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("guild_plugins");
    }

}
