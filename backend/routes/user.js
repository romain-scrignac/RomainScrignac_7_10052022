const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signup);                    // Requête pour création compte utilisateur
router.post('/login', userCtrl.login);                      // Requête pour connexion utilisateur
router.post('/verification', userCtrl.verifCode);           // Requête pour vérification du code email
router.post('/sendcode', userCtrl.sendCode);                // Requête pour renvoyer le code de vérification
router.put('/logout', userCtrl.logout);                     // Requête pour déconnexion utilisateur
router.put('/:id', auth, userCtrl.modifyUser)               // Requête pour modification compte utilisateur
router.delete('/delete', auth, userCtrl.deleteUser);        // Requête pour suppression compte utilisateur

module.exports = router;