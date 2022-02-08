import {MigrationInterface, QueryRunner} from "typeorm";

export class addDescriptionBookVector1644342170018 implements MigrationInterface {
    name = 'addDescriptionBookVector1644342170018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" ADD "description_vector" tsvector DEFAULT NULL`);
        await queryRunner.query(`UPDATE "books" SET "description_vector" = to_tsvector('english', description)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "description_vector"`);
    }

}
