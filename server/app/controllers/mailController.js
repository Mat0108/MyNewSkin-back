var nodemailer = require("nodemailer");
var nodeoutlook = require("nodejs-nodemailer-outlook");
exports.sendMail = (req, res) => {
    // let transporter = nodemailer.createTransport({
    //     service: ‘gmail’,
    //     auth: {
    //     user: process.env.GMAIL_USER,
    //     pass: process.env.GMAIL_PASS,
    //     clientId: process.env.GMAIL_ID,
    //     clientSecret: process.env.GMAIL_SECRET
    //     }
    //     });
    nodeoutlook.sendEmail({
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
            clientId: process.env.GMAIL_ID,
            clientSecret: process.env.GMAIL_SECRET
        },
        from: process.env.GMAIL_USER,
        to: req.body.sendEmail,
        subject: req.body.subject,
        html: "<b>This is bold text</b>",
        text: "This is text version!",
        replyTo: "",
        onError: (e) => {res.status(500);res.send(e)},
        onSuccess: (i) => {res.status(200);res.send("Email envoyé")}
        }
    );
};