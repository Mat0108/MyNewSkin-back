const nodemailer = require("nodemailer");
exports.ErrorMessage = (res,error,message)=>{
    if(process.env.ENV_TYPE == "prod"){
        return res.json({message:message})
    }else{
        return res.json(error)
    }
}
