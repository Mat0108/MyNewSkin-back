require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const app = express();
//SWAGGER (Documentation)
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

var corsOptionsProd = {
  origin: 'po-skin.fr',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
var corsOptionsDev = {
  origin: process.env.DEV_URL,
  optionsSuccessStatus: 200
}
var corsOptions = process.env.ENV_TYPE == "prod" ? corsOptionsProd : corsOptionsDev
app.use(cors(corsOptions));


const db   = require("./app/models");

db.mongoose.connect(db.url,{ useNewUrlParser: true } )
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
const swaggerOptions={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Po. Documentation API',
            version:'1.0.0',
            description:'Documentation for the Po. project',
            contact:{
                name:'Coumba Diankha',
                email:'coumba.diankha@my-digital-school.org', 
            },
            servers:["http://localhost:8080"],
        },
        
    },
    apis:["./app/routes/*.js"]
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to poskin application." });
});

const userRoute = require("./app/routes/userRoute");
const blogRoute = require("./app/routes/blogRoute");
const mailRoute = require("./app/routes/mailRoute");
const rdvRoute = require("./app/routes/rdvRoute")

userRoute(app,corsOptions);
blogRoute(app,corsOptions);
mailRoute(app,corsOptions);
rdvRoute(app,corsOptions);
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
