//Définition de la regex pour une adresse email
const emailRegex = /^[a-z0-9_.+-]+@[a-z0-9-]+\.[a-z0-9-.]+$/i;
    // ^             - start of string
    // [a-z0-9_.+-]  - 1 or more ASCII letters, number or underscore, dot, plus or hyphen
    // @             - At sign required
    // [a-z0-9-]     - 1 or more ASCII letters, number or hyphen
    // \.            - dot required
    // [a-z0-9-.]    - 1 or more ASCII letters, number hyphen or dot
    // $             - end of string
    // /i            - a case insensitive modifier

    
//vérification de la validité de l'email par rapport a la regex
module.exports = (req, res, next) => {
    if (emailRegex.test(req.body.email)){
        next();
    } else {
        return res.status(400).json({ error: 'Email Invalide.'});
    }
};
