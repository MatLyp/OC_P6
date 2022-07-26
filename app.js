const express = require('express');
const mongoose = require('mongoose');
//importation du module Helmet pour la sécurisation des headers http retourné par notre app 
const helmet = require('helmet');
require("dotenv").config();

const path = require('path');

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

const app = express();

//appel et configuration de helmet (autorisation du partage des ressources provenant d'origine différentes pour les images à upload vers le server)
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//configuration de la bdd mongoose
mongoose.connect(`mongodb+srv://${process.env.MONGODB_ACC}:${process.env.MONGODB_PASS}@cluster0.l4vya3y.mongodb.net/?retryWrites=true&w=majority`)
   .then(() => console.log('Connexion à MongoDB réussie !'))
   .catch(() => console.log('Connexion à MongoDB échouée !'));

//configuration des headers
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
});

app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
