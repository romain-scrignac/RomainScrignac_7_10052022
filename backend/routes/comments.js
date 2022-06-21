const express = require('express');
const router = express.Router();
const commentsCtrl = require('../controllers/comments');
const auth = require('../middleware/auth');

router.post('/', auth, commentsCtrl.addComment);                // Requête pour créer un commentaire
router.delete('/:id', auth, commentsCtrl.deleteComment);        // Requête pour supprimer un commentaire

module.exports = router;