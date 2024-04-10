module.exports = (server,corsConfig) => {
    const newsLetterController = require("../controllers/newsLetterController");
    const cors = require('cors');
    /**
     * @openapi
     * paths:
     *  /newsletter/set:
     *   post:
     *     tags:
     *      - Rdv
     *     description: Permet de s'inscrire à la newsletter
    *     requestBody: 
    *          content:
    *              application/json:
    *                  schema:
    *                      $ref: '#components/email'
    *     responses:
    *       200:
    *         description: Utilisateur sauvegardé.
    *         content:
    *             application/json:
    *                schema:
    *                  $ref: '#components/email'
    *       401:
     *         description: Requête invalide;
     */
        server.post("/newsletter/set", cors(corsConfig), newsLetterController.newsLetterRegister);

}