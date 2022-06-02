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
        req.auth = jwt.verify(token, process.env.JWT_KEY);  // Vérification du token

        const findUser = await User.findOne({ where: {user_id: req.auth.userId} });
        if(findUser === null) {
            throw 'User not found!';
        } else if (findUser.user_last_connection < findUser.user_last_disconnection) {
            const erreur = [findUser.user_last_connection - findUser.user_last_disconnection];
            throw erreur;
        }
        // else if (user.isVerified === 0) {    // Vérification email
        //     throw 'Please validate your account first, check your email box';
        // }
        next();
    } catch (err) {
        switchErrors(res, err);
    }
};