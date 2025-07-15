"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowNullCategory1750701347692 = void 0;
class AllowNullCategory1750701347692 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "templates" ALTER COLUMN "category" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "templates" ALTER COLUMN "category" SET NOT NULL`);
    }
}
exports.AllowNullCategory1750701347692 = AllowNullCategory1750701347692;
//# sourceMappingURL=1750701347692-AllowNullCategory.js.map