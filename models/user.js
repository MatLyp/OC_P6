//définition de notre modèle pour nos utilisateurs

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({ 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//le plugin mongoose 'unique validator' verifie qu'un element est bien unique dans la bdd
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);