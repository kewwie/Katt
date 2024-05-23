import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateGroupInvitesTable1716479881745 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "group_invites",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "group_id",
                        type: "varchar",
                        length: "255"
                    },
                    {
                        name: "user_id",    
                        type: "varchar",
                        length: "255"
                    },
                    {
                        name: "inviter_id",
                        type: "varchar",
                        length: "255"
                    },
                    {
                        name: "message_id",
                        type: "varchar",
                        length: "255"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("group_invites");
    }

}
