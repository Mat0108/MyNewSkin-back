const newsLetter = require("../models/newsLetterModel");
exports.newsLetterRegister = (req, res, error) => {
    let newNewsLetter = new newsLetter(req.body);
    newNewsLetter.save((error, newsLetter) => {
        if (error) {
          res.status(401);      
          console.log(error)   
          res.json({ message: "Requête invalide" });
        } else {
          // Envoi de l'e-mail de confirmation
          res.status(200);
          res.json({ message: `Utilisateur sauvegardé : ${newsLetter.email}` });
        }
      });
}