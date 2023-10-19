const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let rdvSchema = new Schema({
  IdentifiantClient: {
    type: String,
    required: true,
  },
  IdentifiantExpert: {
    type: String,
    required: true,
  },
  DateDebut: {
    type: Date,
    required: true,
  },
  DateFin: {
    type: Date,
    required: true,
  },
  Confirmation: {
    type: Number,
    required: true,
  },
  // On ajoute ici, les références aux utilisateurs (compte client et compte expert)
  CompteClient: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

module.exports = mongoose.model("Rdv", rdvSchema);

