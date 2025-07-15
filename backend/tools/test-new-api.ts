import axios from 'axios';
import fs from 'fs';

async function testNewAPI(): Promise<void> {
  try {
    console.log('Testing new generate API...');

    const response = await axios.post(
      'http://localhost:3001/generate',
      {
        templateName: 'Template Social Media', // Remplacez par un nom de template existant
        brandName: 'Ma Brand', // Remplacez par un nom de brand existant
        templateVariables: {
          Titre: 'Test avec la nouvelle API',
          Texte: 'Ceci est un test de la nouvelle structure de requête',
          object: 'rocket',
        },
        width: 1024,
        height: 1024,
      },
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Sauvegarder l'image générée
    fs.writeFileSync('test-generated-image.png', Buffer.from(response.data as ArrayBuffer));
    console.log('✅ Image générée avec succès: test-generated-image.png');
  } catch (error) {
    const axiosError = error as {
      response?: { data?: unknown; status?: number };
      message?: string;
    };
    console.error('❌ Erreur lors du test:', axiosError.response?.data || axiosError.message);

    if (axiosError.response?.status === 404) {
      console.log('💡 Assurez-vous que le template et la brand existent dans la base de données');
    }
  }
}

// Exécuter le test
testNewAPI();

export { testNewAPI };
