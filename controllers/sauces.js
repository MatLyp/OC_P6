//Importation du module 'File System' de NodeJs
const fs = require('fs');

const Sauce = require('../models/sauce');

//Controller de récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//Controller de récupération d'une sauce en particulier (grâce à son id)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

//Controller de création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

//Controller de modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(400).json({ message: 'Non-autorisé' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (err) => {
                    if(err) {
                        throw err;
                    } 
                    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id})
                        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(400).json({ error }));
};

//Controller de suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (err) => {
                    if(err) {
                        throw err;
                    } 
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(400).json({ error }));
}

//Controller de gestion des likes/dislikes
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.userId != req.auth.userId) {
                return res.status(401).json({ message: 'Non-autorisé' });
            }
            switch(req.body.like){
                //-1 = dislike
                case -1:
                    if(!sauce.usersDisliked.includes(req.body.userId) && !sauce.usersLiked.includes(req.body.userId)){
                        Sauce.updateOne({ _id: req.params.id }, 
                            { 
                                $push: { usersDisliked: req.body.userId },
                                $inc: { dislikes: +1 }
                            }
                        )
                        .then(() => res.status(200).json({ message: 'dislike ajouté !' }))
                        .catch(error => res.status(401).json({ error }));
                    } else { res.status(400).json({ error }); }
                break;
                //1 = like
                case 1:
                    if(!sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId)){
                        Sauce.updateOne({ _id: req.params.id },
                            { 
                                $push: { usersLiked: req.body.userId },
                                $inc: { likes: +1 }
                            }
                        )
                        .then(() => res.status(200).json({ message: 'like ajouté !' }))
                        .catch(error => res.status(401).json({ error }));
                    } else { res.status(400).json({ error }); }
                break;
                //0 = annulation du like/dislike
                case 0:
                    if(sauce.usersDisliked.includes(req.body.userId)){
                        Sauce.updateOne({ _id: req.params.id }, 
                            { 
                                $pull: { usersDisliked: req.body.userId },
                                $inc: { dislikes: -1 }
                            }
                        )
                        .then(() => res.status(200).json({ message: 'dislike retiré !' }))
                        .catch(error => res.status(400).json({ error }));
                    } else if(sauce.usersLiked.includes(req.body.userId)){
                        Sauce.updateOne({ _id: req.params.id }, 
                            { 
                                $pull: { usersLiked: req.body.userId },
                                $inc: { likes: -1 }
                            }
                        )
                        .then(() => res.status(200).json({ message: 'like retiré !' }))
                        .catch(error => res.status(400).json({ error }));
                    } else { res.status(400).json({ error }); }
                break;
            }
        })
        .catch(error => res.status(400).json({ error }));
};
