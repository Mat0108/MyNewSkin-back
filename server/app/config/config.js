// Importation du module nodemailer
const nodemailer = require("nodemailer");

// Exportation de la fonction ErrorMessage
exports.ErrorMessage = (res, error, message) => {
    // Vérifie le type d'environnement (production ou autre)
    if (process.env.ENV_TYPE == "prod") {
        // Environnement de production : renvoie une réponse JSON avec le message
        return res.json({ message: message });
    } else {
        // Environnement autre que la production : renvoie une réponse JSON avec l'erreur
        return res.json(error);
    }
}