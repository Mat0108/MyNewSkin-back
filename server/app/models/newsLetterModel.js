const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let newsLetterSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("newsLetter", newsLetterSchema);