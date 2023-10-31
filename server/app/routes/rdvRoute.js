module.exports = (server,corsConfig) => {
    const rdvController = require("../controllers/rdvController");
    const cors = require('cors');

    server.post("/rdv/set", cors(corsConfig), rdvController.createRdv);
    server.get("/rdv/",cors(corsConfig),rdvController.getAllRdvs);
    server.get("/rdv/get/:rdvId",cors(corsConfig),rdvController.getRdvById);
    server.put("/rdv/edit/:rdvId",cors(corsConfig),rdvController.updateRdv);
    server.delete("/rdv/get/:rdvId",cors(corsConfig),rdvController.deleteRdv);
    server.get("/rdv/getbyuser/",cors(corsConfig),rdvController.getRdvbyName);

}