require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const db = require("./app/models");

console.log(db.url);

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
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
const Message = require("./app/models/messageModel");
// const messageRoute = require("./app/routes/messageRoutes")
const { application } = require('express');
// Inscription d'utilisateur
app.post("/message/create", (req, res) => {
  let newMessage = new Message(req.body);
  newMessage.save((error, message) => {
      if (error) {
          res.status(401);
          console.log(error);
          res.json({ message: "Rêquete invalide" });
      }
      else {
          res.status(200);
          res.json(message);
      }
  })
})
app.get("/message/:messageId",(req,res)=>{
  Message.findById(req.params.messageId, (error, message) => {
      if (error) {
          res.status(401);
          console.log(error);
          res.json({ message: "Rêquete invalide" });
      }
      else {
          res.status(200);
          res.json(message);
      }
  })
})
app.get("/messages",(req,res)=>{
  Message.find({},(error,message)=>{
      if (error) {
          res.status(401);
          console.log(error);
          res.json({ message: "Rêquete invalide" });
      }
      else {
          res.status(200);
          res.json(message);
      }
  })
})
// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
