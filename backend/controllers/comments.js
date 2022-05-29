const { Comment, Post, Like } = require('../database/models');
const { validateCommentPayload } = require('../functions/validateform');
const switchErrors = require('../functions/switcherrors');

// Fonction pour afficher tous les commentaires
exports.getAllComments = async (req, res) => {
    try{
        const postId = req.params.id;
        const orderByDate = req.body.orderByDate;
        let sortBy;
        if (!orderByDate) { sortBy = ''; }
            else { sortBy = [['comment_date', 'DESC']]; }

        const findComments = await Comment.findAll({ where: {comment_post_id: postId}, include: Post });
        if (findComments === null) throw 'No comments found!';
        res.status(200).json({ message: findComments });
    }catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour afficher un seul commentaire
exports.getOneComment = async (req, res) => {
    try{

    }catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour ajouter un commentaire
exports.addComment = async (req, res) => {
    try{
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        } else if(!req.body || !req.body.comment) {
            throw 'Bad request!';
        }
        
        const commentObject = req.body.comment;
        const authId = req.auth.userId;

        // Validation du formulaire
        validateCommentPayload(authId, commentObject);

        // Création du commentaire
        const commentAttributes = { 
            comment_content: commentObject.content,
            comment_user_id: commentObject.userId,
            comment_post_id: commentObject.postId
        };

        await Comment.create(commentAttributes, (err) => {
            if(err) throw err;
        })
        res.status(201).json({ message: 'New comment added!' });
    }catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour modifier un commentaire
exports.modifyComment = async (req, res) => {
    try{
        if (!req.auth || !req.auth.userId) {
            throw 'Bad request!';
        } else if(!req.body || !req.body.comment) {
            throw 'Invalid form!';
        }

        const commentId = req.params.id;
        const findComment = await Comment.findOne({ where: {comment_id: commentId} });
        if (findComment === null) throw 'Comment not found!';
        if (findComment.comment_user_id !== req.auth.userId) {
            throw 'Unauthorized request!';
        }

        const commentObject = req.body.comment;
        const authId = req.auth.userId;

        // Validation du formulaire
        validateCommentPayload(authId, commentObject);

        // Création du commentaire
        const commentAttributes = { 
            comment_content: commentObject.content,
            comment_user_id: commentObject.userId,
            comment_post_id: commentObject.postId
        };

        await Comment.update(commentAttributes, (err) => {
            if(err) throw err;
        })
        res.status(200).json({ message: 'Comment updated!' });
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour supprimer un commentaire
exports.deleteComment = async (req, res) => {
    try{
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        } else if(!req.body || !req.body.comment) {
            throw 'Bad request!';
        }

        const commentId = req.params.id;
        const findComment = await Comment.findOne({ where: {comment_id: commentId} });
        if (findComment === null) throw 'Comment not found!';
        if (findComment.comment_user_id !== req.auth.userId) {
            throw 'Unauthorized request!';
        }

        // Suppression de tous les likes du commentaire
        await Like.destroy({ where: {like_comment_id: commentId} }, (err) => {
            if (err) throw err;
        });

        // Suppression du commentaire
        await Comment.destroy({ where: {comment_id: commentId} }, (err) => {
            if (err) throw err;
        });
        res.status(200).json({ message: "Comment deleted !" });
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour le système de like d'un commentaire
exports.likeComment = async (req, res) => {
    try{
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        } else if (!req.body.like || !req.body.commentId || req.body.commentId != req.params.id) {
            throw 'Bad request!';
        }

        const commentId = req.body.commentId;
        const findComment = await Post.findOne({ where: {comment_id: commentId} });
        if (findComment === null) throw 'Comment not found!';

        const like = parseInt(req.body.like);
        if (like !== -1 && like !== 0 && like !== 1) {
            throw 'Invalid value!';
        }

        const findUserLike = await Like.findOne({where : {like_user_id: req.auth.userId, like_comment_id: commentId}});
        // Si l'utilisateur n'a pas encore like/dislike
        if (findUserLike === null && like !== 0) {
            await Like.create({ like_comment_id: commentId, like_user_id: req.auth.userId, like_value: like }, (err) => {
                if (err) throw err;
            });
        }
        // Sinon, on met à jour like_value
        else if (findUserLike !== null) {
            if ((findUserLike.like_value === 0 && like !== 0) || (findUserLike.like_value === 1 && like !== 1) 
            || (findUserLike.like_value === -1 && like !== -1)) {
                await Like.update({like_value: like}, { where: {like_comment_id: commentId, like_user_id: req.auth.userId} },
                 (err) => {
                    if (err) throw err;
                 });
            } else {
                throw 'Bad request!';
            }
        }
        else {
            throw 'Bad request!';
        }
        // Personnalisation du message suivant les cas
        let likeMessage;
        switch (like) {
            case 1:
                if (findUserLike.like_value === -1) {
                    likeMessage = 'Dislike removed / Like added !';
                } else {
                    likeMessage = 'Like added !';
                }
                break;
            case 0:
                if (findUserLike.like_value === 1) {
                    likeMessage = 'Like removed!';
                } else if (findUserLike.like_value === -1) {
                    likeMessage = 'Dislike removed!';
                }
                break;
            case -1:
                if (findUserLike.like_value === 1) {
                    likeMessage = 'Like removed / Dislike added !';
                } else {
                    likeMessage = 'Dislike added !';
                }
        }
        res.status(200).json({ message: likeMessage });
    }catch (err) {
        switchErrors(res, err);
    }
};