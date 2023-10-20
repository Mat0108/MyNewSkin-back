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
                User.findOne({ email: { $in: req.body.CompteExpert } }, (error, CompteExpert) => {
                    if ( error || CompteExpert == null) {
                        res.status(500);
                        console.log(error);
                        res.json({ message: "CompteExpert non trouvés" });
                    } else {
                        let newRdv = new Rdv({
                            DateDebut: new Date(req.body.DateDebut),
                            DateFin: new Date(req.body.DateFin),
                            Confirmation:req.body.Confirmation,
                            CompteClient: CompteClient._id,
                            CompteExpert: CompteExpert._id,
                        });

                        newRdv.save((error, rdv) => {
                            if (error) {
                                res.status(401);
                                // res.json({ message: error });
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
  Rdv.deleteOne({ _id: req.params.rdvId }).then(result => res.status(200).json({ message: "Rdz est bien supprimé", result }))
  .catch((error) => res.status(404).json({ message: "Rdz non trouvé" }))
  
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
