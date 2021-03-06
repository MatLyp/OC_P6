const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();

const path = require('path');

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

const app = express();

mongoose.connect(`mongodb+srv://${process.env.MONGODB_ACC}:${process.env.MONGODB_PASS}@cluster0.l4vya3y.mongodb.net/?retryWrites=true&w=majority`)
   .then(() => console.log('Connexion à MongoDB réussie !'))
   .catch(() => console.log('Connexion à MongoDB échouée !'));

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
