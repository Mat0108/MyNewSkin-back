const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Configurez Nodemailer pour l'envoi d'e-mails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "votreadresse@gmail.com",
    pass: "votremotdepasse",
  },
});

// Inscription d'utilisateur
exports.userRegister = (req, res, error) => {
  let newUser = new User(req.body);

  // Modification inscription user : si le mdp ou le mail ou le firstname et le lastname ne sont pas remplis alors pas d'inscription possible
  if (newUser.password && newUser.email && newUser.firstname && newUser.lastname) {
    bcrypt.hash(newUser.password, 10, (error, hash) => {
      if (error) {
        res.status(401);
        console.log(error);
        res.json({ message: "Impossible de crypter le mot de passe" });
      } else {
        newUser.password = hash;

        newUser.save((error, user) => {
          if (error) {
            res.status(401);
            console.log(error);
            res.json({ message: "Requête invalide" });
          } else {
            // Envoi de l'e-mail de confirmation
            const mailOptions = {
              from: "votreadresse@gmail.com", // Adresse de l'expéditeur
              to: user.email, // Adresse du destinataire
              subject: "Confirmation d'inscription",
              html: `Bienvenue sur notre site ! Cliquez sur le lien ci-dessous pour activer votre compte : <a href="https://votresite.com/activate/${user._id}">Activer le compte</a>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
              } else {
                console.log("E-mail de confirmation envoyé : " + info.response);
              }
            });

            res.status(200);
            res.json({ message: `Utilisateur créé : ${user.email}` });
          }
        });
      }
    });
  } else {
    res.status(401);
    res.json({ message: "Mot de passe est vide" });
    console.log(error);
  }
};


// Connexion d'utilisateur
exports.userLogin = (req, res, error) => {
    User.findOne({ email: req.body.email }, (error, user) => {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({ message: "Utilisateur non trouvé" });
        }
        else {
            if (user.email == req.body.email) {
                bcrypt.compare(req.body.password, user.password, (error, result) => {
                    if (error) {
                        res.status(401);
                        console.log(error);
                        res.json({ message: "Mot de passe incorrect" })
                    }
                    else {
                        if (!user.connected) {
                            user.connected = true;

                            user.save((error, user) => {
                                if (error) {
                                    res.status(401);
                                    console.log(error);
                                    res.json({ message: "Rêquete invalide" });
                                }
                                else {
                                    let userData = {
                                        id: user._id.toString(),
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        email: user.email,
                                        admin: user.admin,
                                        connected: true,
                                    }
                                    res.status(200);
                                    res.json({ message: `Utilisateur connecté : ${user.email}` });
                                    
                                    // jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "30 days" }, (error, token) => {
                                    //     if (error) {
                                    //         res.status(500);
                                    //         console.log(error);
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
                            res.status(401);
                            console.log(error);
                            res.json({ message: "Utilisateur est déjà connecté" });
                        }
                    }
                })
            }
            else {
                res.status(401);
                res.json({ message: "Email ou mot de passe incorrect" });
                console.log(error);
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
                console.log(error);
                res.json({ message: "Utilisateur connecté non trouvé" });
            }
            else {
                if (user.connected) {
                    user.connected = false;

                    user.save((error, user) => {
                        if (error) {
                            res.status(401);
                            console.log(error);
                            res.json({ message: "Rêquete invalide" });
                        }
                        else {
                            res.status(200);
                            res.json({ message: `Utilisateur déconnecté : ${user.email}` });
                        }
                    });
                }
                else {
                    res.status(401);
                    console.log(error);
                    res.json({ message: 'Utilisateur connecté non trouvé' });
                }
            }
        })
    }
    else {
        res.status(401);
        console.log(error);
        res.json({ message: 'Utilisateur connecté non trouvé' });
    }
}


// Afficher tous les utilisateurs
exports.getAllUsers = (req, res) => {
    User.find({}).populate("groups").populate("projects").exec(function (error, users) {
        if (error) {
            res.status(500);
            console.log(error);
            res.json({ message: "Erreur serveur" });
        }
        else {
            res.status(200);
            res.json(users);
        }
    });
}


// Afficher un utilisateur par id
exports.getUserById = (req, res) => {
    User.findById(req.params.userId).populate("groups").populate("projects").exec(function (error, user) {
        if (error) {
            res.status(401);
            res.json({ message: "Utilisateur connecté non trouvé" });
            console.log(error);
        }
        else {
            res.status(200);
            res.json(user);
        }
    });
}

// Modifier tous les informations d'un utilisateur
exports.updateUser = (req, res) => {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true, runValidators: true })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json({ message: "Utilisateur est bien mis à jour", user });
      })
      .catch(error => res.status(500).json({ message: "Erreur serveur", error }));
};
  

/// Supprimer l'utilisateur
exports.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json({ message: "Utilisateur est bien supprimé", user });
      })
      .catch(error => res.status(500).json({ message: "Erreur serveur", error }));
};
  

// Modifier quelques informations de l'utilisateur
exports.patchUser = (req, res) => {
    User.findByIdAndUpdate(req.params.userId, req.body, { new: true })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json({ message: "Utilisateur est bien mis à jour", user });
      })
      .catch(error => res.status(500).json({ message: "Erreur serveur", error }));
};
  