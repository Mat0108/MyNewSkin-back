const Form = require("../models/formModel");
const jwt = require("jsonwebtoken");

exports.createForm = (req, res) => {
    let form = new Form(req.body);
    form.save((error, form) => {
        if (error) {
            res.status(401);
            console.log(error);
            res.json({ message: "Rêquete invalide" });
        }
        else {
            res.status(200);
            res.json({ message: `Form sauvegardé` });
        }})
}

exports.getFormById = (req,res)=>{
    Form.findById(req.params.formId, (error, form) => {
        if (error) {
            res.status(401);
            console.log(error);
            res.json({ message: "Utilisateur connecté non trouvé" });
        }
        else {
            res.status(200)
            res.json(form)
        }
    })
}