import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowNullCategory1750701347692 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "templates" ALTER COLUMN "category" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "templates" ALTER COLUMN "category" SET NOT NULL`);
  }
}
