const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let formModel = new Schema({
    sexe: {
        type: String
    },
    préoccupation : {
        type: Array
    },
    produits_utilisé:{
        type: Array
    },
    reaction_de_la_peau: {
        type: Array
    },
    environnement: {
        type: Number,
        default: 0
    },
    fumer: {
        type: Number,
        default: 0
    },
    couleur_de_peau:{
        type: Number
    },
    freq_expo_soleil:{
        type: Number
    },
    protection_solaire:{
        type: Number
    },

});

module.exports = mongoose.model("Form", userSchema);