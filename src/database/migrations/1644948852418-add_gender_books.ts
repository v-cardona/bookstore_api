import {MigrationInterface, QueryRunner} from "typeorm";

export class addGenderBooks1644948852418 implements MigrationInterface {
    name = 'addGenderBooks1644948852418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "language_code"`);
        await queryRunner.query(`DROP TYPE "public"."users_language_code_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."books_genders_enum" AS ENUM('ACTION', 'CRIME', 'FANTASY')`);
        await queryRunner.query(`ALTER TABLE "books" ADD "genders" "public"."books_genders_enum" array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "genders"`);
        await queryRunner.query(`DROP TYPE "public"."books_genders_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."users_language_code_enum" AS ENUM('en', 'es')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "language_code" "public"."users_language_code_enum" NOT NULL DEFAULT 'en'`);
    }

}
