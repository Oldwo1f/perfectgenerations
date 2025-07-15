import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPreviewImage1750702053707 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "templates" ADD "previewImage" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "previewImage"`);
  }
}
