import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAuthUsersTable1715021157856 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "auth_users",
                columns: [
                    {
                        name: "userId",
                        type: "varchar",
                        length: "255",
                        isPrimary: true,
                    },
                    {
                        name: "tokenType",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "accessToken",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "expires",
                        type: "datetime",
                    },
                    {
                        name: "refreshToken",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "username",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "discriminator",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "tag",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "avatarUrl",
                        type: "varchar",
                        length: "255",
                    },
                ],
            }
        ));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("auth_users");
    }

}
