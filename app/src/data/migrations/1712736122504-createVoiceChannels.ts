import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVoiceChannels1712736122504 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "voiceChannels",
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
                        name: "joinTime",
                        type: "datetime"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("voiceChannels");
    }

}
