import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMemberLevelsTable1727286824095 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'member_levels',
                columns: [
                    {
                        name: 'guild_id',
                        type: 'bigint',
                        isPrimary: true,
                        isNullable: false,
                        unsigned: true
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isPrimary: true,
                        isNullable: false,
                        unsigned: true
                    },
                    {
                        name: "user_name",
                        type: "varchar",
                        length: "32",
                        isNullable: false
                    },
                    {
                        name: 'level',
                        type: 'int',
                        isNullable: false,
                        unsigned: true,
                        default: '0'
                    }
                ]
            }), true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('member_levels');
    }

}
