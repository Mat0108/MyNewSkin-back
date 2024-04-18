const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let formModel = new Schema({
    acné: [{ type: Number }],
    sensibilité_peau: [{ type: Number }],
    taches_pigmentaires: [{ type: Number }],
    rides_ridules: [{ type: Number }],
    eczéma: [{ type: Number }],
    rosacée: [{ type: Number }],
    rides_prononcées: [{ type: Number }],
    élasticité: [{ type: Number }],
    réaction_produits: [{ type: Number }],
    rougeurs_picotements: [{ type: Number }],
    antécédents_allergiques: [{ type: Number }],
    routine_nettoyage: [{ type: Number }],
    utilisation_démaquillant: [{ type: Number }],
    problèmes_nettoyage: [{ type: Number }],
    Exfoliation_fréquence: [{ type: Number }],
    fréquence_exfoliation: [{ type: Number }],
    problèmes_exfoliation: [{ type: Number }],
    type_hydratant: [{ type: Number }],
    efficacité_hydratant: [{ type: Number }],
    problèmes_hydratation: [{ type: Number }],
    application_protection_solaire: [{ type: Number }],
    indice_SPF: [{ type: Number }],
    problèmes_soleil: [{ type: Number }],
    port_maquillage: [{ type: Number }],
    type_maquillage: [{ type: Number }],
    problèmes_maquillage: [{ type: Number }],
    habitudes_vie: [{ type: Number }],
    mail:{
        type:String
    },
    date:{
        type:Date
    }
    

});

module.exports = mongoose.model("Form", formModel);