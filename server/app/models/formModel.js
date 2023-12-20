const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let formModel = new Schema({
    question1: [{
        type: Number
    }],
    question2: [{
        type: Number
    }],
    question3: [{
        type: Number
    }],
    question4: [{
        type: Number
    }],
    question5: [{
        type: Number
    }],
    mail:{
        type:String
    },
    date:{
        type:Date
    }
    

});

module.exports = mongoose.model("Form", formModel);