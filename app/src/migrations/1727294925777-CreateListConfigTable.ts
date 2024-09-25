import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateListsConfigTable1727294925777 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'list_config',
                columns: [
                    {
                        name: 'guild_id',
                        type: 'bigint',
                        isPrimary: true,
                        isNullable: false,
                        unsigned: true
                    },
                    {
                        name: 'log_channel',
                        type: 'bigint',
                        isNullable: true,
                        unsigned: true,
                        default: null
                    }
                ]
            }), true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('list_config');
    }

}
