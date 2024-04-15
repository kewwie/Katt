import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVoiceActivity1712736323691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "voiceActivity",
                columns: [
                    {
                        name: "guildId",
                        type: "varchar",
                        isPrimary: true,
                        isUnique: true
                    },
                    {
                        name: "userId",
                        type: "varchar",
                    },
                    {
                        name: "minutes",
                        type: "int",
                        isNullable: false,
                        default: 0
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
