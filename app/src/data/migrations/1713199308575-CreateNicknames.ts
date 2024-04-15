import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateNicknames1713199308575 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "nicknames",
                columns: [
                    {
                        name: "userId",
                        type: "varchar",
                        isPrimary: true,
                    },
                    {
                        name: "guildId",
                        type: "varchar"
                    },
                    {
                        name: "nickname",
                        type: "varchar"
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
