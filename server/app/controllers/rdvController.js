const Rdv = require("../models/rdvModel"); 
const User = require('../models/userModel');

// Contrôleur pour créer un nouveau rendez-vous
exports.createRdv = (req, res) => {
    User.findOne({ email: req.body.CompteClient }, (error, CompteClient) => {
        if (error || CompteClient == null) {
            res.status(500);
            console.log(error);
            res.json({ message: "CompteClient non trouvé" });
        } else {
            // Récupération des informations sélectionnées par l'utilisateur depuis le corps de la requête
            const selectedDate = new Date(req.body.selectedDate);
            const selectedTime = req.body.selectedTime;
            const selectedExpert = req.body.selectedExpert;
            // Calcul de la date de fin en ajoutant 20 minutes à la date de début
            const selectedEndTime = new Date(selectedDate);
            selectedEndTime.setMinutes(selectedEndTime.getMinutes() + 20);
            // Recherche du compte expert associé à l'adresse e-mail sélectionnée
            User.findOne({ email: { $in: selectedExpert } }, (error, CompteExpert) => {
                if (error || CompteExpert == null) {
                    res.status(500);
                    console.log(error);
                    res.json({ message: "CompteExpert non trouvé" });
                } else {
                    // Création du nouveau rendez-vous avec les informations sélectionnées
                    let newRdv = new Rdv({
                        DateDebut: selectedDate,
                        DateFin: selectedEndTime,
                        Confirmation: req.body.Confirmation,
                        CompteClient: CompteClient._id,
                        CompteExpert: CompteExpert._id,
                    });
                    // Enregistrement du nouveau rendez-vous dans la base de données
                    newRdv.save((error, rdv) => {
                        if (error) {
                            res.status(401);
                            res.json({ message: "Échec de la création du rendez-vous" });
                        } else {
                            // Création d'un résumé des choix de l'utilisateur
                            const summary = {
                                date: selectedDate,
                                time: selectedTime,
                                expert: selectedExpert,
                            };
                            res.status(200);
                            res.json({ message: "Rendez-vous créé", summary });
                        }
                    });
                }
            });
        }
    });
};

// Contrôleur pour récupérer tous les rendez-vous
exports.getAllRdvs = (req, res) => {
  Rdv.find({}).populate("CompteClient").populate("CompteExpert").exec(function(error,rdv){
    if (error) {
      res.status(401);
      console.log(error);
      res.json({ message:error });
  }
  else {
      res.status(200);
      res.json(rdv);
  }
  });
};
// Contrôleur pour récupérer un rendez-vous par son ID
exports.getRdvById = async (req, res) => {
    Rdv.findById(req.params.rdvId).populate("CompteClient").populate("CompteExpert").exec(function(error,rdv){
      if (error) {
        res.status(401);
        console.log(error);
        res.json({ message:error });
    }
    else {
        res.status(200);
        res.json(rdv);
    }
    });
};

// Contrôleur pour mettre à jour un rendez-vous par son ID
exports.updateRdv = async (req, res) => {
  Rdv.findByIdAndUpdate(req.params.rdvId, req.body, { new: true }).populate("users").exec(function(error,rdv){
    if (error) {
      res.status(401);
      console.log(error);
      res.json({ message:error });
  }
  else {
      res.status(200);
      res.json(rdv);
  }

  });
  
};

// Contrôleur pour supprimer un rendez-vous par son ID
exports.deleteRdv = async (req, res) => {
  Rdv.deleteOne({ _id: req.params.rdvId }).then(result => res.status(200).json({ message: "Rdv est bien supprimé", result }))
  .catch((error) => res.status(404).json({ message: "Rdv non trouvé" }))
  
};

exports.getRdvbyName = (req,res)=>{
    User.findOne({ email: req.body.Compte }, (error, Compte) => {
        if(error || Compte == null){
            res.status(401);
            console.log(error);
            res.json({ message:error });
        }else{
            Rdv.find({$or:[{CompteClient:Compte._id},{CompteExpert:Compte._id}]}).populate("CompteClient").populate("CompteExpert").exec(function(error,rdv){
                if (error) {
                  res.status(401);
                  console.log(error);
                  res.json({ message:error });
              }
              else {
                  res.status(200);
                  res.json(rdv);
              }
            
              });
        }
    })
   
}
