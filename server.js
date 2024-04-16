require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
let version = "2.1.0";
// Import de la documentation Swagger
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const User = require('./app/models/userModel');
const bcrypt = require("bcrypt");
const { protectedRoute } = require("./app/config/config");
// Middleware pour analyser les requêtes au format JSON
app.use(express.json());

// Middleware pour analyser les requêtes au format x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// Configuration des options CORS en fonction de l'environnement
var corsOptionsProd = {
  origin: process.env.PROD_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
var corsOptionsDev = {
  origin: process.env.DEV_URL,
  optionsSuccessStatus: 200
}
var corsOptions = process.env.ENV_TYPE == "prod" ? corsOptionsProd : process.env.ENV_TYPE == "dev" ? corsOptionsDev : null
app.use(cors(corsOptions));

// Connexion à la base de données MongoDB via Mongoose
const db = require("./app/models");
db.mongoose.connect(db.url, { useNewUrlParser: true })
  .then(() => {
  
    console.log("Connecté à la base de données! ");
    console.log(`version : ${version}`)
  })
  .catch(err => {
    console.log("Impossible de se connecter à la base de données!",err);
    process.exit();
  });

// Configuration des options Swagger
const urlSwagger = process.ENV_TYPE == "prod" ? "https://coral-app-d9hf4.ondigitalocean.app" :  "http://localhost:8080"
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Po. Documentation API',
      version: version,
      description: 'Documentation pour le projet Po.',
      contact: {
        name: 'Coumba Diankha',
        email: 'coumba.diankha@my-digital-school.org',
      },
      servers: [urlSwagger],
    },
  },
  apis: ["./app/routes/*.js"] // Spécifiez ici les fichiers de routes à inclure dans la documentation Swagger
}

// Génération de la spécification Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions)


passport.use(new LocalStrategy({usernameField: 'email'},(email, password, done) => {
  User.findOne({ email: email  }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect email or password.' });
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
          if (isMatch) {
              return done(null, user,{ message: 'Logged In Successfully'});
          } else {
              return done(null, false, { message: 'Incorrect email or password.' });
          }
      });
  });
}));
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
      done(err, user);
  });
});

// Middleware pour la gestion de sessions
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
// Utilisez Passport comme middleware d'authentification
app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
  const path = req.path;
  let routes = protectedRoute();
  // Check if the path is one of the unprotected paths
  if (routes.unprotectedRoutes.some(unprotectedPath => path === unprotectedPath)) {
      return next();
  }else if (routes.protectedRoutes.some(protectedPath => path === protectedPath)) {
    console.log("protectedPath")
    if (req.isAuthenticated()) {
      return next();
    } else {
      console.log("unprotectedPath")
      res.redirect('/login');
    }
  }
  // Check if the path matches the protected pattern
  routes.unprotectedPaths.map(path => {
    const unprotectedPattern = new RegExp("^/" + path + "/.*$"); // Regex to match anything under /path/
    if (unprotectedPattern.test(path)) {
        return next();
    } 
  })
  routes.protectedPaths.map(path => {
    const protectedPattern = new RegExp("^/" + path + "/.*$");
    if (protectedPattern.test(path)) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    } 
  
  });
}
// Middleware pour la gestion de sessions
app.use(ensureAuthenticated);


// Serveur Swagger à l'URL "/api-docs"
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route simple pour la page d'accueil
app.get("/", (req, res) => {
  res.status(200)
  res.json({ message: `Bienvenue sur l'application Po. Version : ${version}` });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/succes',
  failureRedirect: '/erreur'
}));
app.get('/login', (req, res) => {
  res.send('Login Page');
});
app.get('/succes', (req, res) => {
  res.send('succes Page');
});
app.get('/erreur', (req, res) => {
  res.send('Erreur Page');
});


// Ajoutez une route protégée à laquelle seuls les utilisateurs authentifiés auront accès
app.get('/protected', (req, res) => {
  console.log(req.isAuthenticated())
  if (req.isAuthenticated()) {
    // L'utilisateur est authentifié, il peut accéder à cette route
    res.send('Ceci est une route protégée.');
  } else {
    // L'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
    res.redirect('/needLogin');
  }
});


// Import et configuration des routes de l'application
const userRoute = require("./app/routes/userRoute");
const blogRoute = require("./app/routes/blogRoute");
const rdvRoute = require("./app/routes/rdvRoute");
const formRoute = require("./app/routes/formRoute")
const newsLetterRoute = require("./app/routes/newsLetterRoute");
const newsLetterExpertRoute = require("./app/routes/newsLetterExpertRoute");
userRoute(app, corsOptions);
blogRoute(app, corsOptions);
rdvRoute(app, corsOptions);
formRoute(app,corsOptions);
newsLetterRoute(app,corsOptions);
newsLetterExpertRoute(app,corsOptions);

const stripe = require('stripe')('sk_test_51OOzTwCf2iWivd4Sd2YqeU9jGQL5TwM8fm6to0lyYDzN6nURnKBagMnV7oMkG80vLBnxvpNwuzVeJo2A63ufyo6B00qwUvEVBo');

const DOMAIN = process.env.ENV_TYPE == "prod" ? process.env.PROD_URL : process.env.DEV_URL;
console.log('DOMAIN : ', DOMAIN)

app.post('/create-checkout-session/:rdvId', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1OQ4e0Cf2iWivd4SfLZGFXrK',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${DOMAIN}/ConfirmRdv/${req.params.rdvId}?success=true`,
    cancel_url: `${DOMAIN}/ConfirmRdv/${req.params.rdvId}?success=false`,
  });

  res.redirect(303, session.url);
});

// Ajoutez une route pour gérer la connexion (authentification)


// Configuration du port d'écoute du serveur
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT);

module.exports= app