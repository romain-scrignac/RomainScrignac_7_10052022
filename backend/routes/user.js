const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const {avatarFile} = require('../middleware/multer-config');

// Middleware pour renvoyer les erreurs multer au format json
const multerMiddleware = (req, res, next) => {avatarFile(req, res, err => {
    if (err) {
        if (!err.message) {
            err.message = err;
        }
        console.log(err);
        res.status(400).json({ error: err.message });
    } else {
        next();
    }
})};

router.post('/signup', userCtrl.signup);                                    // Requête pour création compte utilisateur
router.post('/login', userCtrl.login);                                      // Requête pour connexion utilisateur
router.post('/verification', userCtrl.verifCode);                           // Requête pour vérification du code d'inscription
router.post('/sendcode', userCtrl.sendCode);                                // Requête pour renvoyer le code de vérification
router.put('/logout', userCtrl.logout);                                     // Requête pour déconnexion utilisateur
router.get('/:id', auth, userCtrl.getProfil)                                // Requête pour récupérer les infos de l'utilisateur
router.put('/:id', auth, multerMiddleware, userCtrl.modifyUser)             // Requête pour modification compte utilisateur
router.delete('/:id', auth, userCtrl.deleteUser);                           // Requête pour suppression compte utilisateur

module.exports = router;