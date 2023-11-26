const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    connected: {
        type: Boolean,
        required: true,
        default: false
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    type: {
        type: Number,
        required: true,
        default: 0
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    imageBase64:{
        type: String
    }
});

module.exports = mongoose.model("User", userSchema);
