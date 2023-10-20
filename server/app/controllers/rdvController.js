const Rdv = require("../models/rdvModel"); 


// Contrôleur pour créer un nouveau rendez-vous
exports.createRdv = async (req, res) => {
  try {
    const newRdv = new Rdv(req.body);
    const savedRdv = await newRdv.save();
    res.status(201).json(savedRdv);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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
