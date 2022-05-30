const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../database/models');
const { validateUserPayload } = require('../functions/validateform');
const switchErrors = require('../functions/switcherrors');
const verifEmail = require('../functions/verifEmail');

// Fonction signup
exports.signup = async (req, res) => {
    try {
        if (!req.body || !req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password) {
            throw 'Invalid form!';
        }
        const userObject = req.body;

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
        verifEmail(userObject.email, userObject.firstname, userCode);

        res.status(201).json({ message: 'User created!' });
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction modify user
exports.modifyUser = async (req, res) => {
    try {
        if (!req.body || !req.body.user) {
            throw 'Bad request!';
        }
        const userObject = req.body.user;
        
        const findUser = await User.findOne({ where: {user_id: req.params.id} });
        if (findUser === null) throw 'User not found!';

        if (!req.auth || !req.auth.userId || req.auth.userId !== findUser.user_id
        || findUser.user_last_connection < findUser.user_last_disconnection) {
            throw 'Unauthorized request!';
        } 

        // vérification du formulaire
        validateUserPayload(req, userObject);

        // Mise à jour de l'utilisateur
        const hash = await bcrypt.hash(userObject.password, 10);
        const userAttributes = {
            user_firstname: userObject.firstname,
            user_lastname: userObject.lastname, 
            user_email: userObject.email,
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
        const findUser = await User.findOne({ where: {user_id: req.auth.userId} });
        if (findUser === null) throw 'User not found!';

        if (!req.auth || !req.auth.userId || req.auth.userId !== findUser.user_id 
        || findUser.user_last_connection < findUser.user_last_disconnection) {
            throw 'Unauthorized request!';
        }

        // On compare les mot de passe
        if (!req.body.user.password) throw 'Password required!';
        const compare = await bcrypt.compare(req.body.user.password, findUser.user_password);
        if (!compare) throw 'Wrong password!';

        // Suppression de l'utilisateur
        await User.destroy({ where: {user_id: req.auth.userId} }, (err) => {
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
        if (!req.body || !req.body.email || !req.body.password) {
            throw 'Invalid form!';
        }

        const findUser = await User.findOne({ where: { user_email: req.body.email } });
        if (findUser === null) throw 'User not found!';
        if (findUser.user_last_connection > findUser.user_last_disconnection) {
            throw 'User already connected!';
        } 

        // on compare les mots de passe
        const compare = await bcrypt.compare(req.body.password, findUser.user_password);
        if (!compare) throw 'Wrong password!';

        if (findUser.isVerified === 0) {
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