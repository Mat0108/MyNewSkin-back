module.exports = (server,corsConfig) => {
    const rdvController = require("../controllers/rdvController");
    const cors = require('cors');
    
    /**
     * @openapi
     * paths:
     *  /rdv/set:
     *   post:
     *     tags:
     *      - Rdv
     *     description: Permet la création d'un rdv 
     *     requestBody: 
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: '#components/schema/rdv'
     *     responses:
     *       200:
     *         description: Le rendez vous a bien été crée.
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/rdv'
     *       500:
     *         description: Impossible de trouver le compte client ou le compte expert
     *       401:
     *         description: Impossible de créer le rdv 
     */
    server.post("/rdv/set", cors(corsConfig), rdvController.createRdv);
    
    /**
     * @openapi
     * paths:
     *  /rdv/:
     *   get:
     *     tags:
     *      - Rdv
     *     description: Retourne tous les rdvs
     *     responses:
     *       200:
     *         description: Retourne tous les rdvs
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/rdv'
    *       401:
     *         description: Impossible de retourne tous les rdvs
     */
    server.get("/rdv/",cors(corsConfig),rdvController.getAllRdvs);
    /**
     * @openapi
     * paths:
     *  /rdv/get/:rdvId:
     *   get:
     *     tags:
     *      - Rdv
     *     description: Retourne le rdv par son id
     *     parameters:
     *      - in: params
     *        name: rdvId
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Retourne le rdv par son id.
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/rdv'
     *       401:
     *         description: Impossible de récuperer le rdv
     */
    server.get("/rdv/get/:rdvId",cors(corsConfig),rdvController.getRdvById);
    /**
     * @openapi
     * paths:
     *  /rdv/get/:rdvId:
     *   delete:
     *     tags:
     *      - Rdv
     *     description: Permet de supprimer un rdv par son id
     *     parameters:
     *      - in: params
     *        name: rdvId
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Le rdv a bien été supprimé.
     *       401:
     *         description: Impossible de supprimer le rdv 
     */
    server.delete("/rdv/get/:rdvId",cors(corsConfig),rdvController.deleteRdv);
    
    /**
     * @openapi
     * paths:
     *  /rdv/getbyuser/:
     *   get:
     *     tags:
     *      - Rdv
     *     description: Permet de recuper tous les rdv par un utilisateur
     *     parameters:
     *      - in: body
     *        name: Compte
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Retourne le rdv .
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/rdv'
     *       401:
     *         description: Impossible de recuperer le rdv 
     */
    server.post("/rdv/getbyuser/",cors(corsConfig),rdvController.getRdvbyName);
    
    
    /**
     * @openapi
     * paths:
     *  /rdv/getbyuserandbydate/:
     *   get:
     *     tags:
     *      - Rdv
     *     description: Permet de recuper tous les rdvs d'un date 
     *     parameters:
     *      - in: body
     *        name: Date
     *        schema:
     *          type: string
     *          format: date
     *     responses:
     *       200:
     *         description: Retourne le rdv .
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/rdv'
     *       401:
     *         description: Impossible de recuperer le rdv  
     */
    server.get("/rdv/getbydate/",cors(corsConfig),rdvController.getRdvByDate);

    /**
     * @openapi
     * paths:
     *  /rdv/update/:
     *   post:
     *     tags:
     *      - Rdv
     *     description: Permet de modifier un rdv 
     *     requestBody: 
     *          content:
     *              application/json:
     *                  schema:
     *                      $ref: '#components/schema/rdv'
     *     responses:
     *       200:
     *         description: Le rendez vous a bien été modifié.
     *         content:
     *             application/json:
     *                schema:
     *                  $ref: '#components/schema/rdv'
     *       401:
     *         description: Impossible de modifier le rdv 
     */
    server.post("/rdv/update/:rdvId",cors(corsConfig),rdvController.updateRdv)
}