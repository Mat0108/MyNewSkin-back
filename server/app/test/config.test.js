// Importation des modules de test (Chai)
const { expect } = require('chai');

// Importation du module à tester
const { ErrorMessage, logoBase64 } = require("../config/config");

// Définir les tests pour ErrorMessage
describe('ErrorMessage Function', () => {
    it('should return a JSON response with the provided message in production environment', () => {
        // Simuler l'environnement de production
        process.env.ENV_TYPE = 'prod';

        // Mock de la fonction de réponse
        const res = {
            json: (data) => {
                expect(data).to.deep.equal({ message: 'Test Message' });
            }
        };

        // Appel de la fonction ErrorMessage
        ErrorMessage(res, null, 'Test Message');
    });

    it('should return a JSON response with the provided error in non-production environment', () => {
        // Simuler un environnement non production
        process.env.ENV_TYPE = 'dev';

        // Mock de la fonction de réponse
        const res = {
            json: (error) => {
                expect(error).to.be.null;
            }
        };

        // Appel de la fonction ErrorMessage
        ErrorMessage(res, { errorCode: 500, errorMessage: 'Internal Server Error' }, 'Test Message');
    });
});

// Définir les tests pour logoBase64
describe('logoBase64 Function', () => {
    it('should return a base64-encoded PNG image string', () => {
        const result = logoBase64();
        // Assurez-vous que le résultat est une chaîne valide commençant par "data:image/png;base64"
        expect(result).to.be.a('string').and.to.match(/^data:image\/png;base64,/);
    });
});
