const express = require('express');
const router = express.Router();
const commentsCtrl = require('../controllers/comments');
const auth = require('../middleware/auth');

router.get('/', auth, commentsCtrl.getAllComments);             // Requête pour récupérer tous les commentaires
router.post('/', auth, commentsCtrl.addComment);                // Requête pour créer un commentaire
router.delete('/:id', auth, commentsCtrl.deleteComment);        // Requête pour supprimer un commentaire
// router.put('/:id', auth, commentsCtrl.modifyComment);           // Requête pour modifier un commentaire
// router.put('/:id/like', auth, commentsCtrl.likeComment);        // Requête pour le statut "Like" d'un commentaire

module.exports = router;