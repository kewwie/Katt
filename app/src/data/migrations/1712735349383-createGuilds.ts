import { MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateGuilds1712735349383 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "guilds",
                columns: [
                    {
                        name: "guildId",
                        type: "varchar",
                        isPrimary: true,
                        isUnique: true
                    },
                    {
                        name: "guestRole",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "memberRole",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "botRole",
                        type: "varchar",
                    },
                    {
                        name: "adminRole",
                        type: "varchar",
                    },
                    {
                        name: "logsChannel",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "pendingChannel",
                        type: "varchar",
                        isNullable: true
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("guilds");
    }

}
