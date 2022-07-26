//Importation du middleware 'multer'
const multer = require('multer');

//Définition du format des images entrantes autorisées
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//Configuration de multer (config. chemin de destination des fichiers enregistrés / config. nom des fichiers enregistré)
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension)
    }
});

module.exports = multer({ storage }).single('image');