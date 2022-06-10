const { Comment, Like, Post, User } = require('../database/models');
const { validatePostPayload } = require('../functions/validateform');
const switchErrors = require('../functions/switcherrors');
const fs = require('fs');
const url = require('url');

// Fonction pour afficher tous les posts
exports.getAllPosts = async (req, res) => {

    // TODO use query strings instead of header for everything related to pagination, sorting (etc.) !!
    const queryObject = url.parse(req.url, true).query;
    console.log(req.url)

    try {
        // Sort by date
        let sortByDate;

        if (queryObject.order === "dateAsc") {
            sortByDate = [['createdAt', 'ASC']];
        } else if (queryObject.order === "dateDesc") {
            sortByDate = [['createdAt', 'DESC']];
        }

        const offset = parseInt(queryObject.offset);
        const userAttr = ['user_firstname', 'user_lastname', 'user_email', 'user_avatar'];
        const allPosts = await Post.findAll({ order: sortByDate, group: ['post_id'],
            include: [
                { 
                    model: User, attributes: userAttr 
                },
                { 
                    model: Comment, separate: true, order: [['createdAt', 'ASC']],
                    include: [
                        { model: User, attributes: userAttr }, 
                        { model: Like, attributes:  ['like_id', 'like_value', 'like_user_id', 'like_type'] }
                    ],
                    attributes: { exclude: ['comment_post_id'] }
                },
                { 
                    model: Like, separate: true, attributes: ['like_id', 'like_value', 'like_user_id', 'like_type']
                }
            ], offset: offset, limit: 10
            
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
            post_user_id: req.auth.userId,
            post_content: postObject.content,
            post_image: postObject.imageUrl,
            post_video: postObject.video
        };        
        const addPost = await Post.create(postAttributes, (err) => {
            if (err) throw err;
        });

        res.status(201).json({ message: 'New post added!', postId: addPost.post_id });
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
        
        const findPost = await Post.findOne({ where: {post_id: postId} });
        if (findPost === null) throw 'Post not found!';
        if (findPost.post_user_id !== req.auth.userId) {
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
        if (findPost.post_image !== null && req.file) {
            const fileName = findPost.post_image.split('images/')[1];
            fs.unlink(`images/${fileName}`, (err) => {
                if (err) throw err;
                console.log(`Old image deleted (${fileName})`);
            });
        }

        let newContent;
        let newImage;
        let newVideo;
        
        if(findPost.post_content && !postObject.content) {
            newContent = '';
        }
        if (postObject.content === findPost.post_content) {
            newContent = findPost.post_content;
        } else {
            newContent = postObject.content;
        }
        if(findPost.post_image && imageUrl === null) {
            newImage = null;
        } else if (postObject.imageUrl !== null) {
            newImage = postObject.imageUrl;
        } else {
            newImage = findPost.post_image;
        }
        if(findPost.post_video && postObject.video === null) {
            newVideo = null;
        } else if (postObject.video === findPost.post_video) {
            newVideo = findPost.post_video; 
        } else {
            newVideo = postObject.video;
        }
        
        // Mise à jour du post
        const postAttributes = {
            post_content: newContent,
            post_image: newImage,
            post_video: newVideo
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
        } else if (!req.params.id) {
            throw 'Bad request!';
        }
        const postId = req.params.id;

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

        // Suppression du post
        await Post.destroy({ where: {post_id: postId} }, (err) => {
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
        
        const findPost = await Post.findOne({ where: {post_id: postId} });
        if (findPost === null) throw 'Post not found!';

        if (like !== 0 && like !== 1) {
            throw 'Invalid value!';
        }

        const findUserLike = await Like.findOne({  where: {like_user_id: userId, like_post_id: postId} });

        // Si l'utilisateur n'a pas encore like
        if (like === 1 && findUserLike === null) {
            await Like.create({ like_post_id: postId, like_user_id: userId, like_value: like, like_type: type }, (err) => {
                if (err) throw err;
            });
        }
        // Sinon, on met à jour like_value
        else if (findUserLike !== null) {
            if ((findUserLike.like_value === 0 && like !== 0) || (findUserLike.like_value === 1 && like !== 1)) {
                await Like.update(
                    {like_value: like, like_type: type}, {
                        where: {like_post_id: postId, like_user_id: userId}
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