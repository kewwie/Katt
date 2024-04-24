import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateBlacklist1713179264608 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "blacklist",
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
                        type: "varchar",
                    },
                    {
                        name: "userId",
                        type: "varchar",
                    },
                    {
                        name: "username",
                        type: "varchar",
                    },
                    {
                        name: "createdBy",
                        type: "varchar",
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("blacklist");
    }

}
