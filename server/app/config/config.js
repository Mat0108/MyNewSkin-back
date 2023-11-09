const nodemailer = require("nodemailer");
exports.ErrorMessage = (res,error,message)=>{
    if(process.env.ENV_TYPE == "prod"){
        return res.json({message:message})
    }else{
        return res.json(error)
    }
}
exports.transporter = nodemailer.createTransport({
    host: 'ex5.mail.ovh.net.',
    port: 587, 
    secure:false,
    auth: {
        user: process.env.OUTLOOK_MAIL,
        pass: process.env.OUTLOOK_PASS
    },
  
  });