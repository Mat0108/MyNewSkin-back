const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let rdvSchema = new Schema({
  DateDebut: {
    type: Date,
    required: true,
  },
  DateFin: {
    type: Date,
    required: true,
  },
  Confirmation: {
    type: Boolean,
    required: true,
  },
  Type:{
    type:Boolean,
    default:false
  },
  // On ajoute ici, les références aux utilisateurs (compte client)
  CompteClient: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  CompteExpert: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  Observation:{
    type:String
  }
});

module.exports = mongoose.model("Rdv", rdvSchema);




