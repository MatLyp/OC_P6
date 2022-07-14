const Sauce = require('../models/sauce');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({error}));
};