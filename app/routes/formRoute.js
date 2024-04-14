module.exports = (server,corsConfig) => {
    const formController = require("../controllers/formController");
    const cors = require('cors');


    /**
     * @openapi
     * paths:
     *  /form/create:
     *   post:
     *     tags:
     *       - Form
     *     description: Permet la création d'un formulaire
     *     requestBody: 
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: '#components/schema/form'
     *     responses:
     *       200:
     *         description: Votre diagnostic a bien été envoyé par mail .
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/form'
     *       401:
     *         description: Impossible de créer le formulaire 
     */
    
    server.post("/form/create", cors(corsConfig), formController.createForm);

    /**
     * @openapi
     * paths:
     *  /form/get/:formId:
     *   get:
     *     tags:
     *       - Form
     *     description: Retourne le formulaire par son id
     *     parameters:
     *      - in: params
     *        name: blogId
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Retourne le formulaire par son id.
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/form'
     *       401:
     *         description: Impossible de récuperer le formulaire
     */
    server.get("/form/get/:formId", cors(corsConfig), formController.getFormById);
    
    /**
     * @openapi
     * paths:
     *  /form/pdf/:formId:
     *   get:
     *     tags:
     *       - Form
     *     description: Retourne le pdf d'un formulaire par son id
     *     parameters:
     *      - in: params
     *        name: blogId
     *        schema:
     *          type: string
     *      - in: body
     *        name: language
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Retourne le pdf d'un formulaire par son id
     *       401:
     *         description: Impossible de récuperer le formulaire
     */
    server.post("/form/pdf/:formId", cors(corsConfig), formController.getFormByIdPdf);

    /**
     * @openapi
     * paths:
     *  /form/mail/:
     *   post:
     *     tags:
     *       - Form
     *     description: Retourne tous les formulaires d'un mail précis.
     *     parameters:
     *      - in: body
     *        name: mail
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Retourne tous les formulaires d'un mail précis.
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/form'
     *       401:
     *         description: Impossible de récuperer le formulaire
     */
    server.post("/form/mail/", cors(corsConfig), formController.getFormsByMail);
}