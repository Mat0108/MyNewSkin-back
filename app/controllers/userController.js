const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const passport = require('passport');
const { ConfirmationClient } = require("../mail/ConfirmationClient");
const { PasswordForgot } = require("../mail/PasswordForgotMail");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// ////////////////////////////////////////////////////////////////////
// passport.use(new GoogleStrategy({
//   clientID: 'YOUR_GOOGLE_CLIENT_ID',
//   clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
//   callbackURL: '/auth/google/callback',
// },
// (accessToken, refreshToken, profile, done) => {
//   // Votre logique pour créer ou récupérer un utilisateur dans la base de données
//   // Utilisez profile.id comme identifiant unique, par exemple.
//   return done(null, profile);
// }));

// // Sérialiser et désérialiser l'utilisateur dans la session
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });
/////////////////////////////////////////////////////////////////

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

// Inscription d'utilisateur
exports.userRegister = (req, res) => {
  let newUser = new User(req.body.user);

  // Modification inscription user : si le mdp ou le mail ou le firstname et le lastname ne sont pas remplis alors pas d'inscription possible
  if (newUser.password && newUser.email && newUser.firstname && newUser.lastname) {
    bcrypt.hash(newUser.password, 10, (error, hash) => {
      if (error) {
        res.status(401);
        res.json({ message: "Impossible de crypter le mot de passe" });
      } else {
        newUser.password = hash;

        newUser.save((error, user) => {
          if (error) {
            res.status(401);
            res.json({ message: "Requête invalide" });
          } else {
            // Envoi de l'e-mail de confirmation
            const mailOptions = {
              from: process.env.OUTLOOK_MAIL, // Adresse de l'expéditeur
              to: user.email, // Adresse du destinataire
              subject: "Confirmation d'inscription",
              html: ConfirmationClient(user.firstname,user._id,req.body.language)
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
              } else {
                console.log("E-mail de confirmation envoyé : " + info.response);
              }
            });

            res.status(200);
            res.json({ message: `Utilisateur créé : ${user.email}` ,data:user});
          }
        });
      }
    });
  } else {
    res.status(401);
    res.json({ message: "Mot de passe est vide" });
    
  }
};


// Connexion d'utilisateur
exports.userLogin = (req, res) => {
    User.findOne({ email: req.body.email }, (error, user) => {
        if (error) {
            res.status(500);
            
            res.json({ message: "Utilisateur non trouvé" });
        }
        else {
            if (user.email == req.body.email) {
                bcrypt.compare(req.body.password, user.password, (error) => {
                    if (error) {
                        res.status(401);
                        
                        res.json({ message: "Mot de passe incorrect" })

                    }
                    else {
                        if (!user.connected) {
                            user.connected = true;

                            user.save((error, user) => {
                                if (error) {
                                    res.status(401);
                                    
                                    
                                    res.json({ message: error })
                                    res.json({ message: "Requête invalide" });
                                }
                                else {
                                    res.status(200);
                                    res.json({ message: `Utilisateur connecté : ${user.email}` ,user});
                                    
                                    // jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "30 days" }, (error, token) => {
                                    //     if (error) {
                                    //         res.status(500);
                                    //         
                                    //         res.json({ message: "Impossible de générer le token" })
                                    //     }
                                    //     else {
                                    //         res.status(200);
                                    //         res.json({ message: `Utilisateur connecté : ${user.email}`, token, user: userData });
                                    //     }
                                    // });
                                }
                            });
                        }
                        else {
                            res.status(200);
                            res.json({ message: "Utilisateur est déjà connecté" ,user});
                        }
                    }
                })
            }
            else {
                res.status(401);
                
                res.json({ message: "Email ou mot de passe incorrect" });
                }
        }
    })
}

// Déconnexion d'utilisateur
exports.userLogout = (req, res, error) => {
    if (req.params.userId) {
        User.findById(req.params.userId, (error, user) => {
            if (error) {
                res.status(401);
                
                res.json({ message: "Utilisateur connecté non trouvé" });
            }
            else {
                if (user.connected) {
                    user.connected = false;
                    user.save((error, user) => {
                        if (error) {
                            res.status(401);
                            res.json({ message: "Requête invalide" });
                        }
                        else {
                            res.status(200);
                            res.json({ message: `Utilisateur déconnecté : ${user.email}` });
                        }
                    });
                }
                else {
                    res.status(200);
                    res.json({ message: 'Utilisateur non connecté ' });
                }
            }
        })
    }
    else {
        res.status(401);
        res.json({ message: 'Utilisateur connecté non trouvé' });
    }
}


// Afficher tous les utilisateurs
exports.getAllUsers = (req, res) => {
    User.find({}).exec(function (error, users) {
        if (error) {
            res.status(500);
            res.json({ message: "Erreur serveur" })
        }
        else {
            res.status(200);
            res.json(users);
        }
    });
}


// Afficher un utilisateur par id
exports.getUserById = (req, res) => {
    User.findById(req.params.userId).exec(function (error, user) {
        if (error) {
            res.status(401);
            res.json({ message: "Utilisateur connecté non trouvé" });
        }
        else {
            res.status(200);
            res.json(user);
        }
    });
}

// Modifier tous les informations d'un utilisateur
exports.updateUser = (req, res) => {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true, runValidators: true }, (error, user) => {
        if (error) {
            res.status(400);
            res.json({ message: "Requête invalide" });
        }
        else {
            if(!Object.keys(user).length){
                res.status(404)
                res.json({ message: "Utilisateur non trouvé" });

            }else{

              res.status(200);
              res.json({ message: "Utilisateur est bien mis à jour", user });
            }
        }
    })
};
  

/// Supprimer l'utilisateur
exports.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.userId,(error, user) => {
      if (error) {
          res.status(400);
          res.json({ message: "Requête invalide" });
      }
      else {
          if(!Object.keys(user).length){
              res.status(404)
              res.json({ message: "Utilisateur non trouvé" });

          }else{

            res.status(200);
            res.json({ message: "Utilisateur est bien été supprimé", user });
          }
      }
  });
};
  

// Modifier quelques informations de l'utilisateur
exports.patchUser = (req, res) => {
    User.findByIdAndUpdate(req.params.userId, req.body, { new: true },(error, user) => {
      if (error) {
          res.status(400);
          res.json({ message: "Requête invalide" });
      }
      else {
          if(!Object.keys(user).length){
              res.status(404)
              res.json({ message: "Utilisateur non trouvé" });

          }else{

            res.status(200);
            res.json({ message: "Utilisateur est bien été mise à jour", user });
          }
      }
  })
};
  
// Fonction pour demander la réinitialisation du mot de passe
exports.demandeReinitialisationMotDePasse = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      res.status(400);
      res.json({ message:"Utilisateur non trouvé"});

    }else{
      const resetToken = require('crypto').randomBytes(20).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expirera après 1 heure
      user.save((error, user) => {
        if (error) {
          res.status(400);
          res.json({ message: "Erreur serveur"});
        }else{
        const mailOptions = {
          from: process.env.OUTLOOK_MAIL, // Adresse de l'expéditeur
          to: user.email,
          subject: "Réinitialisation du mot de passe",
          html: PasswordForgot(resetToken,req.body.language)
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.status(400)
            res.json({ message: "Erreur lors de l'envoi de l'e-mail" });
          }else{
            res.status(200)
            res.json({ message: "E-mail de réinitialisation envoyé avec succès" });
          }
        });
        }
      });
    }

   
  });
};

exports.checkToken = (req,res)=>{
  User.findOne({resetPasswordToken:req.body.resetToken},(error, user) => {
    if(error || !user){ 
      res.status(200)
      res.json({message: "Token invalide",status:false});
    }else {
      if(new Date(user.resetPasswordExpires).getTime() > new Date().getTime()){
        res.status(200)
        res.json({message: "Token valide",status:true,id:user._id});
      }else{
        res.status(200)
        res.json({message: "Token invalide",status:false});
      }
      }
  })
}
// Fonction pour réinitialiser le mot de passe
exports.reinitialiserMotDePasse = (req, res) => {
  User.findOne({resetPasswordToken:req.body.resetToken},(error, user) => {
    if(error || !user){
      res.status(400)
      res.json({ message:"Utilisateur non trouvé"})
    }else {
      if(new Date(user.resetPasswordExpires).getTime() > new Date().getTime()){
        bcrypt.hash(req.body.newPassword, 10, (error, hash) => {
          if (error) {
            res.status(500)
            res.json({ message: "Impossible de crypter le nouveau mot de passe" });
          }else{
            User.findOneAndUpdate({resetPasswordToken:req.body.resetToken},{password:hash,resetPasswordToken:null,resetPasswordExpires:null},{ new: true },(error, user) => {
              if (error) {
                res.status(400)
                res.json({ message: "Erreur serveur" });
              }else{
                res.status(200)
                res.json({ message: "Mot de passe réinitialisé avec succès" });
              }
            });
          }
          
        });  
      
      }else{
        res.status(200)
        res.json({message: "Token invalide",status:false});
      }
      }
  })
  
};
exports.getAllExpert = (req,res) =>{
  User.find({type:1},(error,users)=>{
    if(error || !users){
      res.status(400)
      res.json({ message:"erreur api"})
    }else {
      res.status(200)
      res.json({message: "List Expert",users});
    }
  })
}

exports.activateAccount = (req,res)=>{
  User.findByIdAndUpdate(req.params.userId, {confirmed:true}, { new: true },(error, user) => {
    if (error) {
        res.status(400);
        res.json({ message: "Requête invalide" });
    }
    else {
        if(!Object.keys(user).length){
            res.status(404)
            res.json({ message: "Utilisateur non trouvé" });

        }else{
          //   const mailOptions = {
          //   from: process.env.OUTLOOK_MAIL, // Adresse de l'expéditeur
          //   to: user.email, // Adresse du destinataire
          //   subject: "Confirmation d'inscription",
          //   html: ConfirmationClient(user.firstname,'fr')
          // };
          // transporter.sendMail(mailOptions, (error, info) => {
          //   if (error) {
          //     console.log(error);
          //   } else {
          //     console.log("E-mail de confirmation envoyé : " + info.response);
          //   }
          // });
          res.status(200);
          res.json({ message: "Utilisateur a bien été confirmé", user });
        }
  }})
}