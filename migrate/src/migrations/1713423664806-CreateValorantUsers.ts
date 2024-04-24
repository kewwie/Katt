import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateValorantUsers1713423664806 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "valorant_users",
                columns: [
                    {
                        name: "userId",
                        type: "varchar",
                        length: "255",
                        isPrimary: true,
                        isUnique: true
                    },
                    {
                        name: "puuid",
                        type: "varchar",
                        length: "255"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255"
                    },
                    {
                        name: "tag",
                        type: "varchar",
                        length: "255"
                    },
                    {
                        name: "region",
                        type: "varchar",
                        length: "255"
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("valorant_users");
    }

}
