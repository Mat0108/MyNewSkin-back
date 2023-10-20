module.exports = (server) => {
    const mailController = require("../controllers/mailController");
    const cors = require('cors');
    
    server.post("/mail/send",cors(),mailController.sendMail);

}