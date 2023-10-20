module.exports = (server) => {
    const blogController = require("../controllers/rdvController");
    const cors = require('cors');
    
    server.post("/rdv/set", cors(), rdvController.setRdv);
    server.get("/rdv/",cors(),rdvController.getAllRdv)
    server.get("/rdv/get/:rdvId",cors(),rdvController.getRdv)
    server.delete("/rdv/get/:rdvId",cors(),rdvController.deleteRdv)

}