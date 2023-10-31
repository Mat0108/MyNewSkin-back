module.exports = (server,corsConfig) => {
    const mailController = require("../controllers/mailController");
    const cors = require('cors');
    
    server.post("/mail/send",cors(corsConfig),mailController.sendMail);

}