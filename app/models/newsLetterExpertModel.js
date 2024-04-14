const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let newsLetterExpertSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("newsLetterExpert", newsLetterExpertSchema);