const { ErrorMessage } = require("../config/config");
const { ConfirmationRdv } = require("../mail/ConfirmationRdv");
const Rdv = require("../models/rdvModel"); 
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
// Configurez Nodemailer pour l'envoi d'e-mails
const transporter = nodemailer.createTransport({
    host: 'ex5.mail.ovh.net.',
    port: 587, 
    secure:false,
    auth: {
        user: process.env.OUTLOOK_MAIL,
        pass: process.env.OUTLOOK_PASS
    },
  
  });

  

// Contrôleur pour créer un nouveau rendez-vous
exports.createRdv = (req, res) => {
    User.findOne({ email: req.body.CompteClient }, (error, CompteClient) => {
        if (error || CompteClient == null) {
            res.status(500);
            res.json({ message: "CompteClient non trouvé" });
        } else {
            // Récupération des informations sélectionnées par l'utilisateur depuis le corps de la requête
            const selectedDate = new Date(req.body.DateDebut);
            const selectedTime = req.body.selectedTime;
            // Calcul de la date de fin en ajoutant 20 minutes à la date de début
            const selectedEndTime = new Date(selectedDate);
            selectedEndTime.setMinutes(selectedEndTime.getMinutes() + 20);
            // Recherche du compte expert associé à l'adresse e-mail sélectionnée
            User.findOne({ email: req.body.CompteExpert }, (error, CompteExpert) => {
                if (error || CompteExpert == null) {
                    res.status(500);
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
                            res.json({message:"Impossible de créer le rdv"})
                        } else {
                            // Création d'un résumé des choix de l'utilisateur
                            const summary = {
                                date: selectedDate,
                                time: selectedTime,
                                expert: CompteExpert.email,
                                id:rdv._id
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
      res.json({message:"Impossible de retourne tous les rdvs"})
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
        res.json({message:"Impossible de supprimer le rdv par son id"})
    }
    else {
        res.status(200);
        res.json(rdv);
    }
    });
};

// Contrôleur pour mettre à jour un rendez-vous par son ID
exports.updateRdv = async (req, res) => {
  Rdv.findByIdAndUpdate(req.params.rdvId, req.body, { new: true }).populate("CompteClient").populate("CompteExpert").exec(function(error,rdv){
    if (error) {
        res.status(401);
        res.json({ message:"Impossible d'update le rdv" });
  }
  else {
        if(req.body.hasOwnProperty('Confirmation') && req.body.Confirmation === true){
            const mailOptions = {
                from: process.env.OUTLOOK_MAIL, // Adresse de l'expéditeur
                to: rdv.CompteClient.email, // Adresse du destinataire
                subject: "Rendez-vous confirmé ",
                html: ConfirmationRdv(rdv,req.body.language)
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                console.log(error);
                } else {
                console.log("E-mail de confirmation envoyé : " + info.response);
                }
            });
        }
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
    User.find({ email: req.body.Compte }, (error, Compte) => {
        if(error || Compte == null){
            res.status(401);
            res.json({ message:error });
        }else{
            Rdv.find({$or:[{CompteClient:Compte},{CompteExpert:Compte}]}).populate("CompteClient").populate("CompteExpert").exec(function(error,rdv){
                if (error) {
                  res.status(401);
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
exports.getRdvByDate = (req,res)=>{
    let date = new Date(req.body.Date);
    date.setDate(date.getDate()+1)
    
    Rdv.find({DateDebut:{$gte:new Date(req.body.Date),$lt:date}}).populate("CompteClient").populate("CompteExpert").exec(function(error,rdv){
        if (error) {
            res.status(401);
            res.json({ message:error });
        }
        else {
            res.status(200);
            res.json(rdv);
        }
    
    });
}

