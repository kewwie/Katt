import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateGroupAdmins1713120531101 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "groupAdmins",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "groupId",
                        type: "varchar",
                    },
                    {
                        name: "userId",
                        type: "varchar"
                    },
                    {
                        name: "username",
                        type: "varchar"
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("groupAdmins");
    }

}
