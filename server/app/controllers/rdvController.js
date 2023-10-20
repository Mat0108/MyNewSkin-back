const Rdv = require("../models/rdvModel"); 
const User = require('../models/userModel');


// Contrôleur pour créer un nouveau rendez-vous
exports.createRdv = (req, res) => {
    User.findOne({ email: req.body.CompteClient }, (error, CompteClient) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({ message: "CompteClient non trouvé" });
        } else {
                User.findOne({ email: { $in: req.body.CompteExpert } }, (error, CompteExpert) => {
                    if (error) {
                        res.status(500);
                        console.log(error);
                        res.json({ message: "CompteExpert non trouvés" });
                    } else {
                        let newRdv = new Rdv({
                            DateDebut: req.body.DateDebut,
                            DateFin: req.body.DateFin,
                            Confirmation:req.body.Confirmation,
                            CompteClient: CompteClient._id,
                            CompteExpert: CompteExpert._id,
                        });

                        newRdv.save((error, rdv) => {
                            if (error) {
                                res.status(401);
                                console.log(error);
                                res.json({ message: "Échec de la création du rendez-vous" });
                            } else {
                                res.status(200);
                                res.json({ message: `Rendez-vous créé `});
                            }
                        });
                    }
                });
        }
    });
};

// Contrôleur pour récupérer tous les rendez-vous
exports.getAllRdvs = (req, res) => {
  Rdv.find({}).populate("users").exec(function(error,rdv){
    if (error) {
      res.status(401);
      console.log(error);
      res.json({ message:error });
  }
  else {
      res.status(200);
      res.json(rdz);
  }

  });
};

// Contrôleur pour récupérer un rendez-vous par son ID
exports.getRdvById = async (req, res) => {
    Rdv.findById(req.params.rdvId).populate("users").exec(function(error,rdv){
      if (error) {
        res.status(401);
        console.log(error);
        res.json({ message:error });
    }
    else {
        res.status(200);
        res.json(rdz);
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
      res.json(rdz);
  }

  });
  
};

// Contrôleur pour supprimer un rendez-vous par son ID
exports.deleteRdv = async (req, res) => {
  Rdv.deleteOne({ _id: req.params.rdvId }).then(result => res.status(200).json({ message: "Rdz est bien supprimé", result }))
  .catch((error) => res.status(404).json({ message: "Rdz non trouvé" }))
  
};
