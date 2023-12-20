require("dotenv").config(); // Chargement des variables d'environnement depuis un fichier .env
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const app = express();


///////////////////////////////////////////////////////


let version = "1.8.0"
// Import de la documentation Swagger
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
console.log('corsOptions : ', corsOptions)
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
      servers: ["http://localhost:8080"],
    },
  },
  apis: ["./app/routes/*.js"] // Spécifiez ici les fichiers de routes à inclure dans la documentation Swagger
}

// Génération de la spécification Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions)

// Configurez Passport pour l'authentification
passport.use(new LocalStrategy(
  (username, password, done) => {
    // Ici, vous devrez mettre en place la logique d'authentification en fonction de votre modèle d'utilisateur
    // Par exemple, vérifiez si l'utilisateur existe dans la base de données et si le mot de passe est correct.
    if (username === 'utilisateur' && password === 'motdepasse') {
      return done(null, { username: 'utilisateur' });
    } else {
      return done(null, false, { message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  // Ici, vous devrez récupérer l'utilisateur à partir de la base de données en utilisant l'identifiant d'utilisateur (username).
  done(null, { username });
});


// Middleware pour la gestion de sessions
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
// Utilisez Passport comme middleware d'authentification
app.use(passport.initialize());
app.use(passport.session());


// Serveur Swagger à l'URL "/api-docs"
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route simple pour la page d'accueil
app.get("/", (req, res) => {
  res.json({ message: `Bienvenue sur l'application Po. Version : ${version}` });
});

// Import et configuration des routes de l'application
const userRoute = require("./app/routes/userRoute");
const blogRoute = require("./app/routes/blogRoute");
const mailRoute = require("./app/routes/mailRoute");
const rdvRoute = require("./app/routes/rdvRoute");
const formRoute = require("./app/routes/formRoute")
userRoute(app, corsOptions);
blogRoute(app, corsOptions);
mailRoute(app, corsOptions);
rdvRoute(app, corsOptions);
formRoute(app,corsOptions)

// STRIPE 
///////////////////////////////////////////////////////////////////////////////////
// This is your test secret API key.
const stripe = require('stripe')('sk_test_51OOzTwCf2iWivd4Sd2YqeU9jGQL5TwM8fm6to0lyYDzN6nURnKBagMnV7oMkG80vLBnxvpNwuzVeJo2A63ufyo6B00qwUvEVBo');


const YOUR_DOMAIN = 'http://localhost:3000';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1OP6poCf2iWivd4SRiiGcV0o',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});



// Ajoutez une route pour gérer la connexion (authentification)
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/protected', // Redirige vers une route protégée après la connexion réussie
    failureRedirect: '/login', // Redirige vers une page de connexion en cas d'échec de la connexion
  })
);

// Ajoutez une route protégée à laquelle seuls les utilisateurs authentifiés auront accès
app.get('/protected', (req, res) => {
  if (req.isAuthenticated()) {
    // L'utilisateur est authentifié, il peut accéder à cette route
    res.send('Ceci est une route protégée.');
  } else {
    // L'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
    res.redirect('/login');
  }
});

// Configuration du port d'écoute du serveur
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}.`);
});
