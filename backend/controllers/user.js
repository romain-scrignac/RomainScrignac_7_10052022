const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { Comment, Post, User } = require('../database/models');
const { validateUserPayload } = require('../functions/validateform');
const switchErrors = require('../functions/switcherrors');
const verifEmail = require('../functions/verifEmail');

// Fonction signup
exports.signup = async (req, res) => {
    try {
        if (!req.body || !req.body.user) {
            throw 'Invalid form!';
        }
        const userObject = req.body.user;

        // Vérification du formulaire
        validateUserPayload(userObject);

        // vérification présence email dans la bdd
        const findUser = await User.findOne({ where: { user_email: userObject.email } });
        if (findUser !== null) {
            throw 'This email is already in use, please enter another one!';
        }

        // Création d'un code aléatoire de vérification
        const userCode = Math.random().toString().substring(2,8);

        // Création utilisateur
        const hash = await bcrypt.hash(userObject.password, 10);
        await User.create({ user_firstname: userObject.firstname, user_lastname: userObject.lastname,
        user_email: userObject.email, user_password: hash, user_code: userCode }, (err) => {
                if (err) throw err;
        });

        // Envoi d'un mail de confirmation
        //verifEmail(userObject.email, userObject.firstname, userCode);

        res.status(201).json({ message: 'User created!' });
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction modify user
exports.modifyUser = async (req, res) => {
    try {
        if(!req.auth || !req.auth.userId || req.auth.userId !== JSON.parse(req.params.id)) {
            throw 'Unauthorized request!';
        }
        else if (!req.body || !req.body.account) {
            throw 'Bad request!';
        }
        
        const findUser = await User.findOne({ where: {user_id: req.auth.userId} });
        if (findUser === null) throw 'User not found!';
        if (findUser.user_last_connection < findUser.user_last_disconnection) {
            throw 'You are not logged in!';
        }

        // Si présence image on en définit l'url
        const userObject = req.file ?
        {
            ...JSON.parse(req.body.account),
            avatarUrl: `${req.protocol}://${req.get('host')}/images/avatars/${req.file.filename}`
        } : { ...JSON.parse(req.body.account), avatarUrl: findUser.user_avatar };

        // On récupère le nom de l'ancien avatar pour suppression du serveur
        const fileName = findUser.user_avatar.split('avatars/')[1];

        // vérification du formulaire
        validateUserPayload(userObject);
        
        // Si nouvelle image on supprime l'ancienne
        if (req.file && fileName !== 'avatar.svg') {
            fs.unlink(`images/avatars/${fileName}`, (err) => {
                if (err) {
                    console.log('Avatar not found!');
                } else {
                    console.log(`Old avatar deleted (${fileName})`);
                }
            });
        }
        
        let firstname;
        let lastname;
        let email;
        let hash;
        
        // Vérification de champs non vides et différents de ceux dans la bdd avant sauvegarde
        if (userObject.firstname && userObject.firstname !== findUser.user_firstname) {
            firstname = userObject.firstname;
        } else {
            firstname = findUser.user_firstname;
        }        
        if (userObject.lastname && userObject.lastname !== findUser.user_lastname) {
            lastname = userObject.lastname;
        } else {
            lastname = findUser.user_lastname;
        }        
        if (userObject.email && userObject.email !== findUser.user_email) {
            email = userObject.email;
        } else {
            email = findUser.user_email;
        }        
        if (userObject.password) {
            hash = await bcrypt.hash(userObject.password, 10);
        } else {
            hash = findUser.user_password;
        }

        const userAttributes = {
            user_avatar: userObject.avatarUrl,
            user_firstname: firstname,
            user_lastname: lastname,
            user_email: email,
            user_password: hash
        };

        await User.update(userAttributes, { where: {user_id: req.auth.userId} }, (err) => {
            if (err) throw err;
        });
        res.status(200).json({ message: 'User updated!' });
    } catch (err) {
        switchErrors(res, err);
    }
};

// fonction delete user
exports.deleteUser = async (req, res) => {
    try {
        if (!req.auth | !req.auth.userId || req.auth.userId !== JSON.parse(req.params.id)) {
            throw 'Unauthorized request!';
        }
        const userId = req.auth.userId;

        const findUser = await User.findOne({ where: {user_id: userId} });
        if (findUser === null) throw 'User not found!';
        if (findUser.user_last_connection < findUser.user_last_disconnection) {
            throw 'You are not logged in!';
        }

        // On compare les mot de passe
        if (!req.body.password) throw 'Password required!';
        const compare = await bcrypt.compare(req.body.password, findUser.user_password);
        if (!compare) throw 'Wrong password!';

        // Suppression du compte
        await User.destroy({ where: {user_id: userId} }, (err) => {
            if (err) throw err;
        })
        res.status(200).json({ message: 'User deleted!'});
    } catch (err) {
        switchErrors(res, err);
    }
};

// fonction login
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

        const findUser = await User.findOne({ where: { user_email: userObject.email } });
        if (findUser === null) throw 'User not found!';
        if (session && findUser.user_last_connection > findUser.user_last_disconnection) {
            throw 'User already connected!';
        } 

        // on compare les mots de passe
        const compare = await bcrypt.compare(userObject.password, findUser.user_password);
        if (!compare) throw 'Wrong password!';

        if (findUser.isVerified === 0) {        // Si l'utilisateur n'a pas encore vérifier son adresse mail
            res.status(200).json({ userId: findUser.user_id, isVerified: false });
        } else {
            await User.update({ user_last_connection: Date() }, { where: {user_id: findUser.user_id} }, (err) => {
                if (err) throw err;
            });
    
            const token = jwt.sign(
                { userEmail: findUser.user_email, userId: findUser.user_id }, process.env.JWT_KEY, { expiresIn: '24h' }
            );
            //res.status(200).json({ email: findUser.user_email, token });
            res.status(200).json({ firstname: findUser.user_firstname, userId: findUser.user_id, token: token });
        }        
    } catch (err) {
        switchErrors(res, err);
    }
};

// fonction logout
exports.logout = async(req, res) => {
    try {
        if (!req.body || !req.body.userId) {
            throw 'Bad request!';
        }
        const findUser = await User.findOne({ where: {user_id: req.body.userId} });
        if (findUser === null) throw 'User not found!';
        if (findUser.user_last_connection < findUser.user_last_disconnection) {
            throw 'User already disconnected!';
        }
        await User.update({ user_last_disconnection: Date() }, { where: {user_id: req.body.userId} }, (err) => {
            if (err) throw err;
        });
        res.status(200).json({ message: 'User disconnected!'});
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction verification code
exports.verifCode = async (req, res) => {
    try {
        if(!req.body || !req.body.userId || !req.body.code) {
            throw 'Bad request!';
        }

        const findUser = await User.findOne({ where: {user_id: req.body.userId} });
        if (findUser === null) throw 'User not found!';
        if (findUser.user_code !== req.body.code) throw 'Invalid code!';

        await User.update({ user_last_connection: Date(), isVerified: 1 }, { where: {user_id: req.body.userId} }, (err) => {
            if (err) throw err;
        })

        const token = jwt.sign(
            { userEmail: findUser.user_email, userId: findUser.user_id }, process.env.JWT_KEY, { expiresIn: '24h' }
        );

        res.status(200).json({ firstname: findUser.user_firstname, token: token });
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction send code
exports.sendCode = async (req, res) => {
    try {
        if(!req.body || !req.body.userId) {
            throw 'Bad request!';
        }

        const findUser = await User.findOne({ where: {user_id: req.body.userId} });
        if (findUser === null) throw 'User not found!';

        // Renvoi du code de vérification
        verifEmail(findUser.user_email, findUser.user_firstname, findUser.user_code);

        res.status(200).json({ message: 'The code has been send back!'});
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction get profil account
exports.getProfil = async (req, res) => {
    try {
        if(!req.auth || !req.auth.userId || req.auth.userId !== JSON.parse(req.params.id)) {
            throw 'Unauthorized request!';
        }
        const userId = req.auth.userId;

        const userAttr = ['user_firstname', 'user_lastname', 'user_email', 'user_avatar'];
        const findUser = await User.findOne({ attributes: userAttr, where: {user_id: userId},  });
        if (findUser === null) throw 'User not found!';

        const nbPosts = await Post.findAll({ where: {post_user_id: userId} });
        if (nbPosts === null) throw 'No posts found!';

        const nbComs = await Comment.findAll({ where: {comment_user_id: userId} });
        if (nbComs === null) throw 'No comments found!';

        res.status(200).json({ message: findUser, nbPosts: nbPosts, nbComs: nbComs });
    } catch (err) {
        switchErrors(res, err);
    }
};