import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateGuildAdminsTable1715197994641 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "guild_admins",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "guildId",
                        type: "varchar"
                    },
                    {
                        name: "userId",
                        type: "varchar"
                    },
                    {
                        name: "level",
                        type: "int",
                        default: 1
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("guild_admins");
    }

}
