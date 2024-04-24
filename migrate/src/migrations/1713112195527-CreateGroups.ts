import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateGroups1713112195527 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "groups",
                columns: [
                    {
                        name: "groupId",
                        type: "varchar",
                        isPrimary: true
                    },
                    {
                        name: "name",
                        type: "varchar"
                    },
                    {
                        name: "guildId",
                        type: "varchar",
                    },
                    {
                        name: "roleId",
                        type: "varchar",
                    },
                    {
                        name: "ownerId",
                        type: "varchar",
                    },
                    {
                        name: 'private',
                        type: 'boolean',
                        default: false,
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("groups");
    }

}
