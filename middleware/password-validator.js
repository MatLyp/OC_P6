//Importation du package 'password-validator'
const passwordValidator = require("password-validator");

//création du schéma
const passwordSchema = new passwordValidator();

//le schéma que doit respecter le mot de passe
passwordSchema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have at least 1 uppercase letters
    .has().lowercase()                              // Must have at least 1 lowercase letters
    .has().digits()                                 // Must have at least 1 digits
    .has().not().spaces()                           // Should not have spaces

//vérification de la qualité du password par rapport au schéma
module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    } else {
        return res.status(400).json({ error: `Le mot de passe n'est pas assez fort (${passwordSchema.validate(req.body.password, { list: true })}).` });
    }
};

