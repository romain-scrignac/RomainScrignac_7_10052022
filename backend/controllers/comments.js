const { Comment, User } = require('../database/models');
const { validateCommentPayload } = require('../functions/validateform');
const switchErrors = require('../functions/switcherrors');

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
        } else if (!req.params.id) {
            throw 'Bad request!';
        }
        const commentId = Number(req.params.id);

        // Vérification du rang de l'utilisateur. Si admin, il pourra supprimer le commentaire
        const findUser = await User.findOne({ where: {id: req.auth.userId}, attributes: ['rank'] });
        let isAdmin = false;
        if (findUser !== null && findUser.rank > 2) {
            isAdmin = true;
        }

        // Recherche du commentaire à supprimer
        const findComment = await Comment.findOne({ where: {id: commentId} });
        if (findComment === null) throw 'Comment not found!';
        if (findComment.user_id !== req.auth.userId && !isAdmin) {
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