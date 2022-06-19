const jwt = require ('jsonwebtoken');
const { User } = require('../database/models');
const switchErrors = require ('../functions/switcherrors');

module.exports = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if(!authorization) {    // Vérification de présence du header authorization
            throw 'Unauthenticated user!';
        }
        const token = authorization.split(' ')[1];

        try {
            req.auth = jwt.verify(token, process.env.JWT_KEY);  // Vérification du token
        } catch (err) {
            throw 'Invalid token!';
        }

        const findUser = await User.findOne({ where: {id: req.auth.userId} });
        if(findUser === null) {
            throw 'User not found!';
        } else if (findUser.last_connection < findUser.last_disconnection) {
            throw 'You are not logged in!';
        }
        else if (findUser.isVerified === 0) {       // Vérification du compte utilisateur
            throw 'Please validate your account first, check your email box';
        }
        next();
    } catch (err) {
        switchErrors(res, err);
    }
};