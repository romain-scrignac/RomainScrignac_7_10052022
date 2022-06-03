const { Comment, Like, Post, User } = require('../database/models');
const { validatePostPayload } = require('../functions/validateform');
const switchErrors = require('../functions/switcherrors');
const fs = require('fs');

// Fonction pour afficher tous les posts
exports.getAllPosts = async (req, res) => {
    try {
        // Sort by type
        let sortByDate;
        // console.log(req.headers.query)
        let order;
        if (req.headers.query && req.headers.query.match(/order true/)) {
            order = req.headers.query.split(' ')[1];
            sortByDate = [['createdAt', 'ASC']];
        } else {
            sortByDate = [['createdAt', 'DESC']];
        }

        const userAttr = ['user_firstname', 'user_lastname', 'user_email'];
        const allPosts = await Post.findAll({ order: sortByDate, group: ['post_id'],
            include: [
                { 
                    model: User, attributes: userAttr 
                },
                { 
                    model: Comment, separate: true, order: [['createdAt', 'ASC']], 
                    include: [
                        { model: User, attributes: userAttr }, 
                        { model: Like, attributes:  ['like_id', 'like_value', 'like_user_id'] }
                    ],
                    attributes: { exclude: ['comment_post_id'] }
                },
                { 
                    model: Like, separate: true, attributes: ['like_id', 'like_value', 'like_user_id']
                }
            ]
            // {all: true, nested: true, attributes: {exclude: ['user_password', 'User.Comment']}}, limit: 100
        });
        if (allPosts === null || allPosts.length === 0) {
            throw "No posts found";
        } else {
            res.status(200).json({ allPosts });
        }
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour afficher un seul post
exports.getOnePost = async (req, res) => {
    try {
        const userAttr = ['user_firstname', 'user_lastname', 'user_email'];
        const onePost = await Post.findOne({ 
            where: {post_id: req.params.id},
            include: [
                { 
                    model: User, attributes: userAttr 
                },
                { 
                    model: Comment, separate: true, order: [['comment_date', 'ASC']], 
                    include: [
                        { model: User, attributes: userAttr }, 
                        { model: Like, attributes:  ['like_id', 'like_value', 'like_user_id'] }
                    ],
                    attributes: { exclude: ['comment_post_id'] }
                },
                { 
                    model: Like, separate: true, attributes: ['like_id', 'like_value', 'like_user_id']
                }
            ]
        });
        if (onePost === null) throw 'Post not found!';
        res.status(200).json({ onePost });
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour ajouter un post
exports.addPost = async (req, res) => {
    try {
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        } else if (!req.body || !req.body.content) {
            throw 'Bad request!';
        }

        // Si présence image on en définit l'url
        const postObject = req.file ?
        {
            ...JSON.parse(req.body),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body, imageUrl: null };

        // Si aucune vidéo on définit videoUrl à null
        let videoUrl;
        if (postObject.video === undefined) { videoUrl = null; }
        else { videoUrl = postObject.video; }

        // Validation du formulaire
        const authId = req.auth.userId;
        validatePostPayload(authId, postObject);

        // Création du post
        const postAttributes = { 
            post_content: postObject.content,
            post_user_id: postObject.userId, 
            post_image: postObject.imageUrl,
            post_video: videoUrl
        };        
        await Post.create(postAttributes, (err) => {
            if (err) throw err;
        });
        res.status(201).json({ message: 'New post added!' });
    } catch (err) {
        switchErrors(res, err);
    }
}

// Fonction pour modifier un post
exports.modifyPost = async (req, res) => {
    try {
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        } else if (!req.body || !req.body.postId || req.body.postId != req.params.id) {
            throw 'Bad request!';
        }

        const postId = req.params.id;
        const findPost = await Post.findOne({ where: {post_id: postId} });
        if (findPost === null) throw 'Post not found!';
        if (findPost.post_user_id !== req.auth.userId) {
            throw 'Unauthorized request!';
        }

        // On récupère le nom de l'ancienne image pour suppression du serveur
        const fileName = findPost.post_image.split('images/')[1];

        // Si présence image on en définit l'url
        const postObject = req.file ?
        {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body.post, imageUrl: null };

        // Si aucune vidéo on définit videoUrl à null
        let videoUrl;
        if (postObject.video === undefined) { videoUrl = null; }
        else { videoUrl = postObject.video; }

        // Validation du formulaire
        const authId = req.auth.userId;
        validatePostPayload(authId, postObject);

        // Si nouvelle image on supprime l'ancienne
        if (req.file) {
            fs.unlink(`images/${fileName}`, (err) => {
                if (err) throw err;
                console.log(`Old image deleted (${fileName})`);
            });
        }

        // Mise à jour du post
        const postAttributes = {
            post_content: postObject.content,
            post_image: postObject.imageUrl,
            post_video: videoUrl
        };        
        await Post.update( postAttributes, { where: {post_id: postId} }, (err) => {
            if (err) throw err;
        });
        res.status(200).json({ message: 'Post updated!' });
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour supprimer un post
exports.deletePost = async (req, res) => {
    try {
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        } else if (!req.body.postId || req.body.postId != req.params.id) {
            throw 'Bad request!';
        }

        const postId = req.body.postId;
        const findPost = await Post.findOne({ where: {post_id: postId} });
        if (findPost === null) throw 'Post not found!';
        else if (findPost.post_user_id !== req.auth.userId) {
            throw 'Unauthorized request!';
        }

        // Si image on récupère son nom et on la supprime du serveur
        if (findPost.post_image !== null) {
            const fileName = findPost.post_image.split('images/')[1];
            fs.unlink(`images/${fileName}`, (err) => {
                if (err) throw err;
                console.log(`Old image deleted (${fileName})`);
            });
        }

        // Suppression de tous les likes du post
        await Like.destroy({ where: {like_post_id: postId} }, (err) => {
            if (err) throw err;
        });

        // Suppression de tous les commentaires du post
        await Comment.destroy({ where: {comment_post_id: postId} }, (err) => {
            if (err) throw err;
        });

        // Suppression du post
        await Post.destroy({ where: {post_id: postId} }, (err) => {
            if (err) throw err;
        });
        res.status(200).json({ message: 'Post deleted!' });
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour le système de like d'un post
exports.likePost = async (req, res) => {
    try {
        console.log(req.body)
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        } else if (!req.body.like || !req.body.postId || !req.body.userId || req.body.userId != req.auth.userId) {
            throw 'Bad request!';
        }

        const postId = parseInt(req.body.postId);
        const like = parseInt(req.body.like);
        const userId = parseInt(req.body.userId);

        console.log("like: "+like)
        
        const findPost = await Post.findOne({ where: {post_id: req.body.postId} });
        if (findPost === null) throw 'Post not found!';

        if (like !== 0 && like !== 1) {
            throw 'Invalid value!';
        }

        const findUserLike = await Like.findOne({  where: {like_user_id: userId, like_post_id: postId} });

        // Si l'utilisateur n'a pas encore like
        if (findUserLike === null && like === 1) {
            await Like.create({ like_post_id: postId, like_user_id: req.auth.userId, like_value: like }, (err) => {
                if (err) throw err;
            });
        }
        // Sinon, on met à jour like_value
        else if (findUserLike !== null) {
            if ((findUserLike.like_value === 0 && like !== 0) || (findUserLike.like_value === 1 && like !== 1)) {
                await Like.update({like_value: like}, { where: {like_post_id: req.body.postId, like_user_id: req.auth.userId} },
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
                likeMessage = 'Like added !';
                break;
            case 0:
                likeMessage = 'Like removed!';
        }
        res.status(200).json({ message: likeMessage });
    } catch (err) {
        switchErrors(res, err);
    }
};