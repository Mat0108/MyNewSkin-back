const Form = require("../models/formModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { DiagnosticData, ErrorMessage } = require("./Message");
const {jsPDF}= require("jspdf");
let FontBold = require("../config/Montserrat-ExtraBold");
let FontDemi = require("../config/Montserrat-Medium");
let FontRegular = require("../config/Montserrat-Regular")
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
    form.date = new Date();
    form.save((error, form) => {
        if (error) {
            res.status(401);
            console.log(error);
            res.json({ message: "Rêquete invalide" });
        }
        else {
            var file = new jsPDF();
            //adding Po font to pdf file
            // file.addFileToVFS('Montserrat-ExtraBold.ttf',FontBold);
            // file.addFont('Montserrat-ExtraBold.ttf', 'Montserrat', 'bold');
            // file.addFileToVFS('Montserrat-Medium.ttf',FontDemi);
            // file.addFont('Montserrat-Medium.ttf', 'Montserrat', 'demi');
            // file.addFileToVFS('Montserrat-Regular.ttf', FontRegular);
            // file.addFont('Montserrat-Regular-bold.ttf', 'Montserrat', 'normal');
            
            // console.log(file.getFontList())
            
            //adding Po. logo in pdf file
            file.addImage("data:image/png;base64,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",'png',10,10,30,30)
            let y = 60;
            let x = 10
            file.text("Po.",200,10);
            file.text("po-skin.fr",185,20);
            file.text("contact@po-skin.net",156,30);
            // file.setFont("Montserrat", "bold");
            // file.setFontSize("18");            
            let date = new Date(form.date);
            date = `${date.getDate()>9?date.getDate():`0${date.getDate()}`}/${date.getMonth()>9?date.getMonth():`0${date.getMonth()}`}/${date.getFullYear()}`
            file.text(`Les résultats de votre diagnostic du ${date} : `,x,y)
            let i = 1;
            
            DiagnosticData.map((item,pos)=>{
                // file.setFont("Montserrat", "demi");
                // file.setFontSize("14");
                file.text(`${item.title}`,x,y+10*(i+1))
                i++;
                item.reponses.map((item2,pos2)=>{

                    if(req.body.selected[pos].includes(pos2)){
                        // file.setFont("Montserrat", "normal");
                        // file.setFontSize("12");
                        file.text(`- ${item2}`,x+10,y+10*(i+1))
                        i++;
                       
                    }
                
                })
                i++;
            })
     
            require("fs").writeFileSync('Diagnostic.pdf', file.output(), 'binary');
            const mailOptions = {
                from: process.env.OUTLOOK_MAIL, // Adresse de l'expéditeur
                to: req.body.mail, // Adresse du destinataire
                subject: "Votre diagnostic",
                attachments: [
                    {
                      filename: 'Diagnostic.pdf',
                      content: require("fs").createReadStream('Diagnostic.pdf'),
                    },
                ],
                // attachments: [file],
                html: "Nous vous remercions d'avoir choisi nos services pour votre diagnostic. <br> Vous trouverez votre résultat en pièce jointe. N'hésitez pas à répondre à ce mail si vous souhaitez discuter des résultats, poser des questions ou obtenir des informations supplémentaires.<br> <br>   Po. <br>   po-skin.fr<br>   contact@po-skin.net"
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error){
                    console.log(error);
                    res.json({message: 'error'});
                    res.sendStatus(500);
                }else{
                    // console.log('Message sent: ' + info.response);
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

exports.getFormByIdPdf=(req,res)=>{
    Form.findById(req.params.formId, (error, form) => {
        if (error) {
            res.status(401);
            console.log(error);
            res.json({ message: "Utilisateur connecté non trouvé" });
        }
        else {
            var file = new jsPDF();
            //adding Po font to pdf file
            // file.addFileToVFS('Montserrat-ExtraBold.ttf',FontBold);
            // file.addFont('Montserrat-ExtraBold.ttf', 'Montserrat', 'bold');
            // file.addFileToVFS('Montserrat-Medium.ttf',FontDemi);
            // file.addFont('Montserrat-Medium.ttf', 'Montserrat', 'demi');
            // file.addFileToVFS('Montserrat-Regular.ttf', FontRegular);
            // file.addFont('Montserrat-Regular-bold.ttf', 'Montserrat', 'normal');
            
            // console.log(file.getFontList())
            
            //adding Po. logo in pdf file
            file.addImage("data:image/png;base64,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",'png',10,10,30,30)
            let y = 60;
            let x = 10
            file.text("Po.",200,10);
            file.text("po-skin.fr",185,20);
            file.text("contact@po-skin.net",156,30);
            // file.setFont("Montserrat", "bold");
            // file.setFontSize("18");
            let date = new Date(form.date);
            date = `${date.getDate()>9?date.getDate():`0${date.getDate()}`}/${date.getMonth()>9?date.getMonth():`0${date.getMonth()}`}/${date.getFullYear()}`
            file.text(`Les résultats de votre diagnostic du ${date} : `,x,y)
            let i = 1;
            let selected = [form.question1,form.question2,form.question3,form.question4,form.question5]
            DiagnosticData.map((item,pos)=>{
                // file.setFont("Montserrat", "demi");
                // file.setFontSize("14");
                file.text(`${item.title}`,x,y+10*(i+1))
                i++;
                item.reponses.map((item2,pos2)=>{

                    if(selected[pos].includes(pos2)){
                        // file.setFont("Montserrat", "normal");
                        // file.setFontSize("12");
                        file.text(`- ${item2}`,x+10,y+10*(i+1))
                        i++;
                       
                    }
                
                })
                i++;
            })
     
            res.json(file.output('datauristring'))
            res.status(200)
        }
    })
}

exports.getFormsByMail = (req,res)=>{
    Form.find({mail:req.body.email}, (error, forms) => {
        if (error) {
            res.status(401);
            console.log(error);
            res.json({ message: "Utilisateur connecté non trouvé" });
        }else{
            res.status(200)
            res.json(forms)
        }})
}