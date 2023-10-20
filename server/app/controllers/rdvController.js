const Rdv = require("../models/rdvModel"); 
const User = require('../models/userModel');


// Contrôleur pour créer un nouveau rendez-vous
exports.createRdv = (req, res) => {
    User.findOne({ email: req.body.organizer }, (error, organizer) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({ message: "Organisateur non trouvé" });
        } else {
            if (req.body.participants) {
                User.find({ email: { $in: req.body.participants } }, (error, participants) => {
                    if (error) {
                        res.status(500);
                        console.log(error);
                        res.json({ message: "Participants non trouvés" });
                    } else {
                        let newRdv = new Rdv({
                            title: req.body.title,
                            date: req.body.date,
                            organizer: organizer._id,
                            participants: participants.map(e => e._id),
                        });

                        newRdv.save((error, rdv) => {
                            if (error) {
                                res.status(401);
                                console.log(error);
                                res.json({ message: "Échec de la création du rendez-vous" });
                            } else {
                                res.status(200);
                                res.json({ message: `Rendez-vous créé : ${rdv.title}`, rdvData: newRdv });
                            }
                        });
                    }
                });
            } else {
                let newRdv = new Rdv({
                    title: req.body.title,
                    date: req.body.date,
                    organizer: organizer._id,
                });

                newRdv.save((error, rdv) => {
                    if (error) {
                        res.status(401);
                        console.log(error);
                        res.json({ message: "Échec de la création du rendez-vous" });
                    } else {
                        res.status(200);
                        res.json({ message: `Rendez-vous créé : ${rdv.title}`, rdvData: newRdv });
                    }
                });
            }
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
