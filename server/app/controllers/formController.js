const Form = require("../models/formModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { DiagnosticData, ErrorMessage } = require("./Message");

const transporter = nodemailer.createTransport({
    host: 'ex5.mail.ovh.net.',
    port: 587, 
    secure:false,
    auth: {
        user: process.env.OUTLOOK_MAIL,
        pass: process.env.OUTLOOK_PASS
    },
  
  });

  
exports.createForm = (req, res) => {
    let form = new Form(req.body);
    console.log(form)
    form.save((error, form) => {
        if (error) {
            res.status(401);
            console.log(error);
            res.json({ message: "Rêquete invalide" });
        }
        else {
            let html = "Votre diagnostic <br> <br>"
            DiagnosticData.map((item,pos)=>{
                html += `${item.title}<br>`;
                item.reponses.map((item2,pos2)=>{
                    if(req.body.selected[pos].includes(pos2)){
                        html+=`- ${item2}<br>`
                    }
                
                })
                html+= "<br>"
            })
            
            const mailOptions = {
                from: process.env.OUTLOOK_MAIL, // Adresse de l'expéditeur
                to: req.body.mail, // Adresse du destinataire
                subject: "Votre diagnostic",
                html: html
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error){
                    console.log(error);
                    res.json({message: 'error'});
                    res.sendStatus(500);
                }else{
                    console.log('Message sent: ' + info.response);
                    res.status(200).json({"message": "votre diagnostic a bien été envoyé par mail"})
                };});
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