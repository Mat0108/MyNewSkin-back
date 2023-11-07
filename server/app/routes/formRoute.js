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
     *     description: Create a form
     *     responses:
     *       200:
     *         description: Create a form.
     */
    server.post("/form/create", cors(corsConfig), formController.createForm);

    /**
     * @openapi
     * paths:
     *  /form/get:
     *   post:
     *     tags:
     *       - Form
     *     description: get All form!
     *     responses:
     *       200:
     *         description: return all from
     */
server.get("/form/get", cors(corsConfig), formController.getFormById);
}