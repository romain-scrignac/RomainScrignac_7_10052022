const express = require('express');
const router = express.Router();
const postsCtrl = require('../controllers/posts');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Middleware pour renvoyer les erreurs multer au format json
const multerMiddleware = (req, res, next) => {multer(req, res, err => {
    if (err) {
        if (!err.message) {
            err.message = err;
        }
        res.status(400).json({ err: err.message });
    } else {
        next();
    }
})};

router.get('/', auth, postsCtrl.getAllPosts);                       // Requête pour récupérer tous les posts
router.get('/:id', auth, postsCtrl.getOnePost);                     // Requête pour récupérer un seul post
router.post('/', auth, multerMiddleware, postsCtrl.addPost);        // Requête pour créer un post
router.put('/:id', auth, multerMiddleware, postsCtrl.modifyPost);   // Requête pour modifier un post
router.delete('/:id', auth, postsCtrl.deletePost);                  // Requête pour supprimer un post
router.post('/:id/like', auth, postsCtrl.likePost);                 // Requête pour le statut "Like" d'un post

module.exports = router;