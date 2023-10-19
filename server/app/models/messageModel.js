const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let messageSchema = new Schema({
    context: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Message", messageSchema);