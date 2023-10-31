module.exports = (server,corsConfig) => {
    const formController = require("../controllers/formController");
    const cors = require('cors');


/**
 * @openapi
 * paths:
 *  /form/create:
 *   post:
 *     tags:
 *       - User
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
server.post("/form/create", cors(corsConfig), formController.createForm);

/**
 * @openapi
 * paths:
 *  /form/get:
 *   post:
 *     tags:
 *       - User
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
server.get("/form/get", cors(corsConfig), formController.getFormById);
}