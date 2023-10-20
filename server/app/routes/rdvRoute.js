module.exports = (server) => {
    const rdvController = require("../controllers/rdvController");
    const cors = require('cors');
    
    server.post("/rdv/set", cors(), rdvController.createRdv);
    server.get("/rdv/",cors(),rdvController.getAllRdvs);
    server.get("/rdv/get/:rdvId",cors(),rdvController.getRdvById);
    
    server.delete("/rdv/get/:rdvId",cors(),rdvController.deleteRdv);

}