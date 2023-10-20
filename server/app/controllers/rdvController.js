const Rdv = require("../models/rdvModel"); 
const User = require('./models/userModel');


// Contrôleur pour créer un nouveau rendez-vous
exports.createRdv = async (req, res) => {
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
                                participants.map(e => {
                                    let userRdvs = e.rdvs;
                                    userRdvs.push(rdv._id);

                                    User.findByIdAndUpdate({ _id: e._id }, { rdvs: userRdvs }, { new: true })
                                        .then(result => console.log('result : ', result))
                                        .catch((error) => console.log('error : ', error))
                                })

                                organizer.rdvs.push(rdv._id);
                                User.findByIdAndUpdate({ _id: organizer._id }, { rdvs: organizer.rdvs }, { new: true })
                                    .then(result => console.log('result : ', result))
                                    .catch((error) => console.log('error : ', error))

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
exports.getAllRdvs = async (req, res) => {
  try {
    const rdvs = await Rdv.find();
    res.status(200).json(rdvs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour récupérer un rendez-vous par son ID
exports.getRdvById = async (req, res) => {
  try {
    const rdv = await Rdv.findById(req.params.rdvId);
    if (!rdv) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.status(200).json(rdv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour mettre à jour un rendez-vous par son ID
exports.updateRdv = async (req, res) => {
  try {
    const updatedRdv = await Rdv.findByIdAndUpdate(req.params.rdvId, req.body, { new: true });
    if (!updatedRdv) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.status(200).json(updatedRdv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour supprimer un rendez-vous par son ID
exports.deleteRdv = async (req, res) => {
  try {
    const deletedRdv = await Rdv.findByIdAndRemove(req.params.rdvId);
    if (!deletedRdv) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
