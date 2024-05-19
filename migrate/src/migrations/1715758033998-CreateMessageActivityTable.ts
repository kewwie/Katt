import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMessagesTable1715758033998 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "message_activity",
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
                        name: "messages",
                        type: "int",
                        isNullable: false,
                        default: 0
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("message_activity");
    }

}
