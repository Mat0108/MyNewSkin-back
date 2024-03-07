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
            //adding Po font to pdf file
            // file.addFileToVFS('Montserrat-ExtraBold.ttf',FontBold);
            // file.addFont('Montserrat-ExtraBold.ttf', 'Montserrat', 'bold');
            // file.addFileToVFS('Montserrat-Medium.ttf',FontDemi);
            // file.addFont('Montserrat-Medium.ttf', 'Montserrat', 'demi');
            // file.addFileToVFS('Montserrat-Regular.ttf', FontRegular);
            // file.addFont('Montserrat-Regular-bold.ttf', 'Montserrat', 'normal');
            
            // console.log(file.getFontList())
            
            //adding Po. logo in pdf file
            file.addImage("data:image/png;base64,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",0,0,675,275)
            let y = 60;
            let x = 10;
            // file.setFont("Montserrat", "bold");
            // file.setFontSize("18");            
            let date = new Date(form.date);
            date = `${date.getDate()>9?date.getDate():`0${date.getDate()}`}/${date.getMonth()>9?date.getMonth():`0${date.getMonth()}`}/${date.getFullYear()}`
            file.text(`Les résultats de votre diagnostic du ${date} : `,x,y,'center')
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