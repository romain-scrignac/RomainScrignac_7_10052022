const { Comment, Like, Post, User } = require('../database/models');
const { validatePostPayload } = require('../functions/validateform');
const switchErrors = require('../functions/switcherrors');
const fs = require('fs');
const url = require('url');

// Fonction pour afficher tous les posts
exports.getAllPosts = async (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    try {
        // Sort by date
        let sortByDate;

        if (queryObject.order === "dateAsc") {
            sortByDate = [['updatedAt', 'ASC']];
        } else if (queryObject.order === "dateDesc") {
            sortByDate = [['updatedAt', 'DESC']];
        }

        const offset = parseInt(queryObject.offset);
        const userAttr = ['firstname', 'lastname', 'avatar', 'last_connection', 'last_disconnection'];
        const allPosts = await Post.findAll({ order: sortByDate, group: ['id'],
            include: [
                { 
                    model: User, attributes: userAttr
                },
                { 
                    model: Comment, separate: true, order: [['createdAt', 'ASC']],
                    include: [
                        { model: User, attributes: userAttr },
                        { model: Like, attributes:  ['id', 'user_id', 'value', 'type'] }
                    ],
                    attributes: { exclude: ['post_id'] }
                },
                { 
                    model: Like, separate: true, attributes: ['id', 'user_id', 'value', 'type']
                }
            ], 
            offset: offset, limit: 10
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

// // Fonction pour afficher un seul post
// exports.getOnePost = async (req, res) => {
//     try {
//         const userAttr = ['user_firstname', 'user_lastname', 'user_email'];
//         const onePost = await Post.findOne({ 
//             where: {post_id: req.params.id},
//             include: [
//                 { 
//                     model: User, attributes: userAttr 
//                 },
//                 { 
//                     model: Comment, separate: true, order: [['comment_date', 'ASC']], 
//                     include: [
//                         { model: User, attributes: userAttr }, 
//                         { model: Like, attributes:  ['like_id', 'like_value', 'like_user_id'] }
//                     ],
//                     attributes: { exclude: ['comment_post_id'] }
//                 },
//                 { 
//                     model: Like, separate: true, attributes: ['like_id', 'like_value', 'like_user_id']
//                 }
//             ]
//         });
//         if (onePost === null) throw 'Post not found!';
//         res.status(200).json({ onePost });
//     } catch (err) {
//         switchErrors(res, err);
//     }
// };

// Fonction pour ajouter un post
exports.addPost = async (req, res) => {
    try {
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        } else if (!req.body.post) {
            throw 'Bad request!';
        }

        // Si présence image on en définit l'url
        const postObject = req.file ?
        {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body.post, imageUrl: null };

        // Validation du formulaire
        validatePostPayload(postObject);

        // Création du post
        const postAttributes = {
            user_id: req.auth.userId,
            content: postObject.content,
            image: postObject.imageUrl,
            video: postObject.video
        };        
        const addPost = await Post.create(postAttributes, (err) => {
            if (err) throw err;
        });

        res.status(201).json({ message: 'New post added!', postId: addPost.id });
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour modifier un post
exports.modifyPost = async (req, res) => {    
    try {
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        } else if (!req.params.id || !req.body.post) {
            throw 'Bad request!';
        }
        const postId = req.params.id;
        
        const findPost = await Post.findOne({ where: {id: postId} });
        if (findPost === null) throw 'Post not found!';
        if (findPost.user_id !== req.auth.userId) {
            throw 'Unauthorized request!';
        }

        // Si présence image on en définit l'url
        const postObject = req.file ?
        {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body.post, imageUrl: null };

        // Validation du formulaire
        validatePostPayload(postObject);

        // Si ancienne image, on la supprime si nouvel ajout
        if (findPost.image !== null && req.file) {
            const fileName = findPost.image.split('images/')[1];
            fs.unlink(`images/${fileName}`, (err) => {
                if (err) throw err;
                console.log(`Old image deleted (${fileName})`);
            });
        }

        let newContent;
        let newImage;
        let newVideo;
        
        if(findPost.content && !postObject.content) {
            newContent = '';
        }
        if (postObject.content === findPost.content) {
            newContent = findPost.content;
        } else {
            newContent = postObject.content;
        }
        if(findPost.image && imageUrl === null) {
            newImage = null;
        } else if (postObject.imageUrl !== null) {
            newImage = postObject.imageUrl;
        } else {
            newImage = findPost.image;
        }
        if(findPost.video && postObject.video === null) {
            newVideo = null;
        } else if (postObject.video === findPost.video) {
            newVideo = findPost.video; 
        } else {
            newVideo = postObject.video;
        }
        
        // Mise à jour du post
        const postAttributes = {
            content: newContent,
            image: newImage,
            video: newVideo
        };

        await Post.update( postAttributes, { where: {id: postId} }, (err) => {
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
        } else if (!req.params.id) {
            throw 'Bad request!';
        }
        const postId = req.params.id;

        const findPost = await Post.findOne({ where: {id: postId} });
        if (findPost === null) throw 'Post not found!';
        else if (findPost.user_id !== req.auth.userId) {
            throw 'Unauthorized request!';
        }

        // Si image on récupère son nom et on la supprime du serveur
        if (findPost.image !== null) {
            const fileName = findPost.image.split('images/')[1];
            fs.unlink(`images/${fileName}`, (err) => {
                if (err) throw err;
                console.log(`Old image deleted (${fileName})`);
            });
        }

        // Suppression du post
        await Post.destroy({ where: {id: postId} }, (err) => {
            if (err) throw err;
        });
        res.status(200).json({ message: `Post deleted!` });
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
        } else if (!req.body.like || !req.body.postId || !req.body.type) {
            throw 'Bad request!';
        }

        const postId = parseInt(req.body.postId);
        const like = parseInt(req.body.like);
        const userId = parseInt(req.auth.userId);
        const type = req.body.type;
        
        const findPost = await Post.findOne({ where: {id: postId} });
        if (findPost === null) throw 'Post not found!';

        if (like !== 0 && like !== 1) {
            throw 'Invalid value!';
        }

        const findUserLike = await Like.findOne({  where: {user_id: userId, post_id: postId} });

        // Si l'utilisateur n'a pas encore like
        if (like === 1 && findUserLike === null) {
            await Like.create({ post_id: postId, user_id: userId, value: like, type: type }, (err) => {
                if (err) throw err;
            });
        }
        // Sinon, on met à jour like_value
        else if (findUserLike !== null) {
            if ((findUserLike.value === 0 && like !== 0) || (findUserLike.value === 1 && like !== 1)) {
                await Like.update(
                    {value: like, type: type}, {
                        where: {post_id: postId, user_id: userId}
                    },(err) => {
                        if (err) throw err;
                    }
                );
            } else {
                throw 'Bad request!';
            }
        } else {
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