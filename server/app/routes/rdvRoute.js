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
     *     description: API allowing the user to create a rdv
     *     parameters:
     *      - in: body
     *        name: DateDebut
     *        schema:
     *          type: string
     *      - in: body
     *        name: DateFin
     *        schema:
     *          type: string
     *      - in: body
     *        name: Confirmation
     *        schema:
     *          type: boolean
     *      - in: body
     *        name: CompteClient
     *        schema:
     *          type: string
     *      - in: body
     *        name: CompteExpert
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Rendez-vous créé 
     */
    server.post("/rdv/set", cors(corsConfig), rdvController.createRdv);
    
    /**
     * @openapi
     * paths:
     *  /rdv/:
     *   get:
     *     tags:
     *      - Rdv
     *     description: API allowing the user to get all user
     *     parameters:
     *     
     *     responses:
     *       200:
     *         description: get all rdvs
     */
    server.get("/rdv/",cors(corsConfig),rdvController.getAllRdvs);
    /**
     * @openapi
     * paths:
     *  /rdv/get/:rdvId:
     *   get:
     *     tags:
     *      - Rdv
     *     description: API allowing the user to create a rdv
     *     parameters:
     *      - in: params
     *        name: rdvId
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: get one rdv by id 
     */
    server.get("/rdv/get/:rdvId",cors(corsConfig),rdvController.getRdvById);
    /**
     * @openapi
     * paths:
     *  /rdv/get/:rdvId:
     *   delete:
     *     tags:
     *      - Rdv
     *     description: API allowing the user to delete a rdv
     *     parameters:
     *      - in: params
     *        name: rdvId
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Rendez-vous supprimé 
     */
    server.delete("/rdv/get/:rdvId",cors(corsConfig),rdvController.deleteRdv);
    
    /**
     * @openapi
     * paths:
     *  /rdv/getbyuser/:
     *   get:
     *     tags:
     *      - Rdv
     *     description: API allowing the user to get a rdv by name
     *     parameters:
     *      - in: body
     *        name: Compte
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Get rendez-vous 
     */
    server.post("/rdv/getbyuser/",cors(corsConfig),rdvController.getRdvbyName);
    
    
    /**
     * @openapi
     * paths:
     *  /rdv/getbyuserandbydate/:
     *   get:
     *     tags:
     *      - Rdv
     *     description: API allowing the user to get a rdv by name and by date
     *     parameters:
     *      - in: body
     *        name: Compte
     *        schema:
     *          type: string
     *      - in: body
     *        name: Date
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: Get all rendez-vous  
     */
server.get("/rdv/getbydate/",cors(corsConfig),rdvController.getRdvByDate);
}