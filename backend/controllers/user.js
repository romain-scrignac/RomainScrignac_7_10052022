const { User } = require('../database/models');
const { validateUserPayload } = require('../functions/validateform');
const switchErrors = require('../functions/switcherrors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const url = require('url');

// Fonction pour s'inscrire sur le réseau social
exports.signup = async (req, res) => {
    try {
        if (!req.body || !req.body.user) {
            throw 'Invalid form!';
        }
        const userObject = req.body.user;

        // Vérification du formulaire
        validateUserPayload(userObject);

        // vérification présence email dans la bdd
        const findUser = await User.findOne({ where: { email: userObject.email } });
        if (findUser !== null) {
            throw 'This email is already in use, please enter another one!';
        }

        // Création utilisateur
        const hash = await bcrypt.hash(userObject.password, 10);
        await User.create({ firstname: userObject.firstname, lastname: userObject.lastname,
        email: userObject.email, password: hash }, (err) => {
                if (err) throw err;
        });

        res.status(201).json({ message: 'User created!' });
    } catch (err) {
        switchErrors(res, err);
    }
};

// fonction pour se connecter
exports.login = async (req, res) => {
    try {
        if (!req.body || !req.body.user || !req.body.user.email || !req.body.user.password) {
            throw 'Invalid form!';
        }
        const userObject = req.body.user;

        let session = false;
        if(userObject.session && userObject.session !== undefined) {
            session = true;
        }

        const findUser = await User.findOne({ where: { email: userObject.email } });
        if (findUser === null) throw 'User not found!';
        if (session && findUser.last_connection > findUser.last_disconnection) {
            throw 'User already connected!';
        } 

        // on compare les mots de passe
        const compare = await bcrypt.compare(userObject.password, findUser.password);
        if (!compare) throw 'Wrong password!';

        if (findUser.isVerified === 0) {        // Si l'utilisateur n'a pas encore vérifier son adresse mail
            res.status(200).json({ userId: findUser.id, isVerified: false });
        } else {
            await User.update({ last_connection: Date() }, { where: {id: findUser.id} }, (err) => {
                if (err) throw err;
            });
    
            const token = jwt.sign(
                { userEmail: findUser.email, userId: findUser.id }, process.env.JWT_KEY, { expiresIn: '24h' }
            );
            res.status(200).json({ firstname: findUser.firstname, userId: findUser.id, token: token, rank: findUser.rank });
        }        
    } catch (err) {
        switchErrors(res, err);
    }
};

// fonction pour se déconnecter
exports.logout = async (req, res) => {
    try {
        if (!req.body || !req.body.userId) {
            throw 'Bad request!';
        }
        const userId = Number(req.body.userId);

        const findUser = await User.findOne({ where: {id: userId} });
        if (findUser === null) throw 'User not found!';

        await User.update({ last_disconnection: Date() }, { where: {id: userId} }, (err) => {
            if (err) throw err;
        });
        res.status(200).json({ message: 'User disconnected!'});
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour voir le profil utilisateur + liste de tous les autres si admin
exports.getProfil = async (req, res) => {
    console.log(typeof req.auth.userId)
    try {
        if (!req.params.id) {
            throw 'Bad request!';
        }

        const findAdmin = await User.findOne({ where: {id: req.auth.userId},  });
        let isAdmin = false;
        if (findAdmin !== null && findAdmin.rank === 3) {
            isAdmin = true;
        }        
        const userId = JSON.parse(req.params.id);

        if(!isAdmin && (!req.auth || !req.auth.userId || req.auth.userId !== userId)) {
            throw 'Unauthorized request!';
        }

        const userAttributes = ['id', 'firstname', 'lastname', 'email', 'avatar', 'rank'];
        const findUser = await User.findOne({ attributes: userAttributes, where: {id: userId} });
        if (findUser === null) throw 'User not found!';

        // Si admin on envoie la liste de tous les utilisateurs
        if (isAdmin) {
            const usersList = await User.findAll({attributes: ['id', 'firstname', 'lastname', 'rank'] });
            res.status(200).json({ user: findUser,  usersList: usersList });
        } else {
            res.status(200).json({ user: findUser });
        }  
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour modifier le profil utilisateur
exports.modifyUser = async (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    try {
        if (!queryObject.admin && (!req.params.id || !req.body || !req.body.account)) {
            throw 'Bad request!';
        } 
        else if (queryObject.admin && (!req.params.id || !req.body || !req.body.accountRank)) {
            throw 'Bad request!';
        }
        const userId = JSON.parse(req.params.id);

        // Recherche si c'est un admin qui modifie le compte
        const findAdmin = await User.findOne({ where: {id: req.auth.userId} });
        let isAdmin = false;
        if (findAdmin !== null && findAdmin.rank === 3) {
            isAdmin = true;
        }
        
        // Vérification du droit de modification
        if(req.auth.userId !== JSON.parse(req.params.id) && !isAdmin ||     // Si mauvais utilisateur et non admin
        (isAdmin && findAdmin.id !== userId && !req.body.accountRank) ||    // Si admin et compte différent du sien et autre champ que rank 
        !isAdmin && req.body.accountRank) {                                 // Si non admin et changement de privilèges
            throw 'Unauthorized request!';
        }

        // Recherche du compte à modifier
        const findUser = await User.findOne({ where: {id: userId} });
        if (findUser === null) throw 'User not found!';

        // Si c'est un admin qui modifie les privilèges de l'utilisateur
        if (isAdmin && req.body.accountRank) {
            await User.update({ rank: req.body.accountRank }, {where: {id: userId}}, (err) => {
                if (err) throw err;
            });
            res.status(200).json({ message: "User's privileges updated!" });
        } 
        // Sinon c'est une modification des infos de l'utilisateur de son propre compte...
        else if (!isAdmin || (isAdmin && userId === findAdmin.id)) {            
            // Si présence image on en définit l'url
            const userObject = req.file ?
            {
                ...JSON.parse(req.body.account),
                avatarUrl: `${req.protocol}://${req.get('host')}/images/avatars/${req.file.filename}`
            } : { ...req.body.account, avatarUrl: findUser.avatar };

            // On récupère le nom de l'ancien avatar pour suppression du serveur
            const fileName = findUser.avatar.split('avatars/')[1];

            // vérification du formulaire
            validateUserPayload(userObject);

            console.log(fileName)

            // Si nouvelle image met à jour l'avatar
            if (req.file) {
                // On supprime l'ancienne image sauf si c'est l'avatar par défaut
                if (fileName !== 'avatar.svg') {
                    fs.unlink(`images/avatars/${fileName}`, (err) => {
                        if (err) {
                            console.log('Avatar not found!');
                        } else {
                            console.log(`Old avatar deleted (${fileName})`);
                        }
                    });
                }
                await User.update({ avatar: userObject.avatarUrl }, { where: {id: userId} }, (err) => {
                    if (err) throw err;
                });
            }

            // Update firstname
            if (userObject.firstname && userObject.firstname !== findUser.firstname) {
                await User.update({ firstname: userObject.firstname }, { where: {id: userId} }, (err) => {
                    if (err) throw err;
                });
            } 

            // Update lastname
            if (userObject.lastname && userObject.lastname !== findUser.lastname) {
                await User.update({ lastname: userObject.lastname }, { where: {id: userId} }, (err) => {
                    if (err) throw err;
                });
            } 

            // Update email
            if (userObject.email && userObject.email !== findUser.email) {
                await User.update({ email: userObject.email }, { where: {id: userId} }, (err) => {
                    if (err) throw err;
                });
            } 

            // Update password
            if (userObject.password) {
                const hash = await bcrypt.hash(userObject.password, 10);
                await User.update({ password: hash }, { where: {id: userId} }, (err) => {
                    if (err) throw err;
                });
            }

            res.status(200).json({ message: "User's account updated!" });
        }
    } catch (err) {
        switchErrors(res, err);
    }
};

// fonction pour supprimer un compte utilisateur
exports.deleteUser = async (req, res) => {
    try {
        if (!req.params.id) {
            throw 'Bad request!';
        }
        const userId = JSON.parse(req.params.id);

        // Recherche si c'est un admin qui veut supprimer le compte
        const findAdmin = await User.findOne({ attibutes: ['rank']}, { where: {id: req.auth.userId} });
        let isAdmin = false;
        if (findAdmin !== null && findAdmin.rank === 3) {
            isAdmin = true;
        }

        // Vérification du droit de suppression
        if (!req.auth | !req.auth.userId || req.auth.userId !== userId && !isAdmin) {
            throw 'Unauthorized request!';
        }
        
        // Recherche du compte à supprimer
        const findUser = await User.findOne({ where: {id: userId} });
        if (findUser === null) throw 'User not found!';

        // Suppression du compte
        await User.destroy({ where: {id: userId} }, (err) => {
            if (err) throw err;
        })
        res.status(200).json({ message: 'User deleted!'});
    } catch (err) {
        switchErrors(res, err);
    }
};