import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateLoginsTable1715021086533 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "logins",
            columns: [
                {
                    name: "userId",
                    type: "varchar",
                    length: "255",
                    isPrimary: true,
                },
                {
                    name: "token",
                    type: "varchar",
                    length: "255",
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
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("logins");
    }

}
