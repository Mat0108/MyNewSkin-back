require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
  origin: 'po-skin.fr',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));


const db = require("./app/models");

db.mongoose.connect(db.url,{ useNewUrlParser: true } )
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
  

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
