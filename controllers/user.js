const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

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

exports.login = (req, res, next) => {
    // we use mongoose user model to verify the email exist in our db
    User.findOne({ email: req.body.email })
        .then(user => {
            // if it doesnt exist, return error 401: Unauthorized
            if (!user) {
                return res.status(401).json({ message: 'Association email/mot de passe incorrecte !' });
            }
            // if the email exist in our db, we use the compare method from bcrypt to know if the (hash)password associated to that user is correct
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // if not, return the same error than previously (for security we can't let the user know if the email entered is correct or not)
                    if (!valid) {
                        return res.status(401).json({ message: 'Association email/mot de passe incorrecte !' });
                    }
                    // when the email + password is valid return code 200 and the id of the user with a token (using the .sign fonction from json web token)
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
