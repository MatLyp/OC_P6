//importation du package de cryptage de mot de passe
const bcrypt = require('bcrypt');
//importation du package de création/gestion de web token pour la sécurisation des authentifications
const jwt = require('jsonwebtoken');
//importation du module de configuration de fichiers .env pour cacher les données sensibles
require('dotenv').config();

const User = require('../models/user');

//Controller de création de compte d'un nouvel utilisateur
exports.signUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then( () => res.status(201).json({ message: 'Nouvel utilisateur créé.' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//Controller de connexion d'un utilisateur déjà enregistré dans la bdd
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Association email/mot de passe incorrecte !' });
            }
            //Utilisation de la méthode 'compare' de bcrypt pour comparer avec le mdp crypté enregistré dans la bdd
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Association email/mot de passe incorrecte !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_SECRET_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
