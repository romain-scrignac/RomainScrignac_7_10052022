const { Comment, Post, Like } = require('../database/models');
const { validateCommentPayload } = require('../functions/validateform');
const switchErrors = require('../functions/switcherrors');
const url = require('url');

// Fonction pour ajouter un commentaire
exports.addComment = async (req, res) => {
    try{
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        } else if(!req.body || !req.body.content || !req.body.postId) {
            throw 'Bad request!';
        }        
        const commentObject = req.body;

        // Validation du formulaire
        validateCommentPayload(commentObject);

        // Création du commentaire
        const commentAttributes = { 
            post_id: commentObject.postId,
            user_id: req.auth.userId,
            content: commentObject.content
        };

        const addComment = await Comment.create(commentAttributes, (err) => {
            if(err) throw err;
        });

        res.status(201).json({ message: 'New comment added!', commentId: addComment.id });
    }catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour supprimer un commentaire
exports.deleteComment = async (req, res) => {
    try{
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        } else if(!req.body || !req.body.commentId) {
            throw 'Bad request!';
        }
        const commentId = req.body.commentId;

        const findComment = await Comment.findOne({ where: {id: commentId} });
        if (findComment === null) throw 'Comment not found!';
        if (findComment.user_id !== req.auth.userId) {
            throw 'Unauthorized request!';
        }

        // Suppression du commentaire
        await Comment.destroy({ where: {id: commentId} }, (err) => {
            if (err) throw err;
        });
        res.status(200).json({ message: "Comment deleted !" });
    } catch (err) {
        switchErrors(res, err);
    }
};

// // Fonction pour le système de like d'un commentaire
// exports.likeComment = async (req, res) => {
//     try{
//         if (!req.auth || !req.auth.userId) {
//             throw 'Unauthorized request!';
//         } else if (!req.body.like || !req.body.commentId) {
//             throw 'Bad request!';
//         }
//         const commentId = req.body.commentId;

//         const findComment = await Post.findOne({ where: {id: commentId} });
//         if (findComment === null) throw 'Comment not found!';

//         const like = parseInt(req.body.like);
//         if (like !== 0 && like !== 1) {
//             throw 'Invalid value!';
//         }

//         const findUserLike = await Like.findOne({where : {like_user_id: req.auth.userId, like_id: commentId}});
//         // Si l'utilisateur n'a pas encore like/dislike
//         if (findUserLike === null && like !== 0) {
//             await Like.create({ like_id: commentId, like_user_id: req.auth.userId, like_value: like }, (err) => {
//                 if (err) throw err;
//             });
//         }
//         // Sinon, on met à jour like_value
//         else if (findUserLike !== null) {
//             if ((findUserLike.like_value === 0 && like !== 0) || (findUserLike.like_value === 1 && like !== 1)) {
//                 await Like.update({like_value: like}, { where: {like_id: commentId, like_user_id: req.auth.userId} },
//                  (err) => {
//                     if (err) throw err;
//                  });
//             } else {
//                 throw 'Bad request!';
//             }
//         }
//         else {
//             throw 'Bad request!';
//         }
//         // Personnalisation du message suivant les cas
//         let likeMessage;
//         switch (like) {
//             case 1:
//                 likeMessage = 'Like added !';
//                 break;
//             case 0:
//                 likeMessage = 'Like removed!';
//                 break;
//         }
//         res.status(200).json({ message: likeMessage });
//     }catch (err) {
//         switchErrors(res, err);
//     }
// };