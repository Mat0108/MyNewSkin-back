require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const db = require("./app/models");

console.log(db.url);

mongoose
  .connect("mongodb://admin:sVCIgSQGJTK76pv2eFdKEuiO@MongoS3601A.back4app.com:27017/2fb4ddc747cc4adbb0d8b9415add6eab ")
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

userRoute(app);
blogRoute(app);
// const messageRoute = require("./app/routes/messageRoutes")
const { application } = require('express');
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
