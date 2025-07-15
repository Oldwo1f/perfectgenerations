"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testNewAPI = testNewAPI;
const axios_1 = require("axios");
const fs_1 = require("fs");
async function testNewAPI() {
    try {
        console.log('Testing new generate API...');
        const response = await axios_1.default.post('http://localhost:3001/generate', {
            templateName: 'Template Social Media',
            brandName: 'Ma Brand',
            templateVariables: {
                Titre: 'Test avec la nouvelle API',
                Texte: 'Ceci est un test de la nouvelle structure de requête',
                object: 'rocket',
            },
            width: 1024,
            height: 1024,
        }, {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        fs_1.default.writeFileSync('test-generated-image.png', Buffer.from(response.data));
        console.log('✅ Image générée avec succès: test-generated-image.png');
    }
    catch (error) {
        const axiosError = error;
        console.error('❌ Erreur lors du test:', axiosError.response?.data || axiosError.message);
        if (axiosError.response?.status === 404) {
            console.log('💡 Assurez-vous que le template et la brand existent dans la base de données');
        }
    }
}
testNewAPI();
//# sourceMappingURL=test-new-api.js.map