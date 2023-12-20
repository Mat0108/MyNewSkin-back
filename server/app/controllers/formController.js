const Form = require("../models/formModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { DiagnosticData, ErrorMessage } = require("./Message");
const {jsPDF}= require("jspdf");
let FontBold = require("../config/Montserrat-ExtraBold-bold");
let FontDemi = require("../config/Montserrat-Medium-bold");
let FontRegular = require("../config/Montserrat-Regular-normal");
const { logoBase64 } = require("../config/config");
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
            var pageHeight = file.internal.pageSize.height || file.internal.pageSize.getHeight();
            var pageWidth = file.internal.pageSize.width || file.internal.pageSize.getWidth();
            
            //adding Po. logo in pdf file
            file.addImage(logoBase64(),'png',15,15,pageWidth/6,24)
           


            let y = 90;
            let x = 20
            file.setFont("Montserrat-Medium", "bold");
            
            file.setFontSize("12");
            file.text("Po.",190,50);
            file.text("po-skin.fr",176,57);
            file.text("contact@po-skin.net",151,64);
            
            file.setFont("Montserrat-ExtraBold", "bold");
            file.setFontSize("16");
            let date = new Date(form.date);
            date = `${date.getDate()>9?date.getDate():`0${date.getDate()}`}/${date.getMonth()>9?date.getMonth():`0${date.getMonth()}`}/${date.getFullYear()}`
            file.text(`Les résultats de votre diagnostic du ${date} : `, pageWidth / 2, y,{align: 'center'})
            let i = 1;
            let selected = [form.question1,form.question2,form.question3,form.question4,form.question5]
            DiagnosticData.map((item,pos)=>{
                y+= 3;
                file.setFont("Montserrat-Medium", "bold");
                file.setFontSize("16");
                if(item.title === "Quelles sont vos préoccupations principales en matière de soins de la peau ?"){
                    file.text(`Quelles sont vos préoccupations principales en matière`,x,y+6*(i+1))
                    i++;
                    file.text(`de soins de la peau ?`,x,y+6*(i+1))
                }else if(item.title === "Quels produits de soins de la peau utilisez vous régulièrement ?"){
                    file.text(`Quels produits de soins de la peau utilisez vous`,x,y+6*(i+1))
                    i++;
                    file.text(`régulièrement ?`,x,y+6*(i+1))
                }else{
                    file.text(`${item.title}`,x,y+6*(i+1))
                }
                i++;
                item.reponses.map((item2,pos2)=>{

                    if(selected[pos].includes(pos2)){
                        file.setFont("Montserrat-Regular", "normal");
                        file.setFontSize("14");
                        file.text(`- ${item2}`,x+10,y+2+6*(i+1))
                        i++;
                       
                    }
                
                })
                i++;
            })

            i += 4;
            file.setFont("Montserrat-Medium", "bold");
            file.setFontSize("16");
            file.text(`Po. vous remercie de votre confiance `, pageWidth / 2, y+6*(i+1),{align: 'center'})
     
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
            var pageHeight = file.internal.pageSize.height || file.internal.pageSize.getHeight();
            var pageWidth = file.internal.pageSize.width || file.internal.pageSize.getWidth();
            
            //adding Po. logo in pdf file
            file.addImage(logoBase64(),'png',15,15,pageWidth/6,24)
           


            let y = 90;
            let x = 20
            file.setFont("Montserrat-Medium", "bold");
            
            file.setFontSize("12");
            file.text("Po.",190,50);
            file.text("po-skin.fr",176,57);
            file.text("contact@po-skin.net",151,64);
            
            file.setFont("Montserrat-ExtraBold", "bold");
            file.setFontSize("16");
            let date = new Date(form.date);
            date = `${date.getDate()>9?date.getDate():`0${date.getDate()}`}/${date.getMonth()>9?date.getMonth():`0${date.getMonth()}`}/${date.getFullYear()}`
            file.text(`Les résultats de votre diagnostic du ${date} : `, pageWidth / 2, y,{align: 'center'})
            let i = 1;
            let selected = [form.question1,form.question2,form.question3,form.question4,form.question5]
            DiagnosticData.map((item,pos)=>{
                y+= 3;
                file.setFont("Montserrat-Medium", "bold");
                file.setFontSize("16");
                if(item.title === "Quelles sont vos préoccupations principales en matière de soins de la peau ?"){
                    file.text(`Quelles sont vos préoccupations principales en matière`,x,y+6*(i+1))
                    i++;
                    file.text(`de soins de la peau ?`,x,y+6*(i+1))
                }else if(item.title === "Quels produits de soins de la peau utilisez vous régulièrement ?"){
                    file.text(`Quels produits de soins de la peau utilisez vous`,x,y+6*(i+1))
                    i++;
                    file.text(`régulièrement ?`,x,y+6*(i+1))
                }else{
                    file.text(`${item.title}`,x,y+6*(i+1))
                }
                i++;
                item.reponses.map((item2,pos2)=>{

                    if(selected[pos].includes(pos2)){
                        file.setFont("Montserrat-Regular", "normal");
                        file.setFontSize("14");
                        file.text(`- ${item2}`,x+10,y+2+6*(i+1))
                        i++;
                       
                    }
                
                })
                i++;
            })

            i += 4;
            file.setFont("Montserrat-Medium", "bold");
            file.setFontSize("16");
            file.text(`Po. vous remercie de votre confiance `, pageWidth / 2, y+6*(i+1),{align: 'center'})
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