"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPreviewImage1750702053707 = void 0;
class AddPreviewImage1750702053707 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "templates" ADD "previewImage" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "previewImage"`);
    }
}
exports.AddPreviewImage1750702053707 = AddPreviewImage1750702053707;
//# sourceMappingURL=1750702053707-AddPreviewImage.js.map