import {MigrationInterface, QueryRunner} from "typeorm";

export class fixNameDetail1641827639575 implements MigrationInterface {
    name = 'fixNameDetail1641827639575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "name" SET NOT NULL`);
    }

}
