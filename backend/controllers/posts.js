const { Comment, Like, Post, User } = require('../database/models');
const { validatePostPayload } = require('../functions/validateform');
const switchErrors = require('../functions/switcherrors');
const fs = require('fs');
const url = require('url');

// Fonction pour afficher tous les posts
exports.getAllPosts = async (req, res) => {
    const queryObject = url.parse(req.url, true).query;
    try {
        if(!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        }
        // Sort by date
        let sortByDate;

        if (queryObject.order === "dateAsc") {
            sortByDate = [['updatedAt', 'ASC']];
        } else if (queryObject.order === "dateDesc") {
            sortByDate = [['updatedAt', 'DESC']];
        }

        const userAttributes = ['id', 'firstname', 'lastname', 'avatar', 'last_connection', 'last_disconnection'];
        const allPosts = await Post.findAll({ order: sortByDate, group: ['id'],
            include: [
                { 
                    model: User, attributes: userAttributes
                },
                { 
                    model: Comment, 
                    separate: true, 
                    order: [['createdAt', 'ASC']],
                    include: [
                        { model: User, attributes: userAttributes }
                    ],
                    attributes: { exclude: ['post_id'] }
                },
                { 
                    model: Like, separate: true, attributes: ['id', 'user_id', 'value', 'type']
                }
            ]
        });
        if (allPosts === null) {
            throw 'An error has occurred!';
        }else {
            res.status(200).json({ allPosts: allPosts });
        }
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour ajouter un post
exports.addPost = async (req, res) => {
    try {
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        } else if (!req.body.post) {
            throw 'Bad request!';
        }
        
        // Si pr??sence image on en d??finit l'url
        const postObject = req.file ?
        {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body.post, imageUrl: null };

        // Validation du formulaire
        validatePostPayload(postObject);

        // Cr??ation du post
        const postAttributes = {
            user_id: req.auth.userId,
            content: postObject.content,
            image: postObject.imageUrl
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

        // V??rification du rang de l'utilisateur. Si admin ou modo, il pourra modifier le post
        const findUser = await User.findOne({ where: {id: req.auth.userId}, attributes: ['rank'] });
        let isModeration = null;
        if (findUser !== null) {
            if (findUser.rank === 2) {
                isModeration = "mod??rateur";
            } else if (findUser.rank === 3) {
                isModeration = "admin";
            }
        }

        // Recherche du post ?? modifier
        const findPost = await Post.findOne({ 
            where: {id: postId},
            include: { model: User, attributes: ['rank'] }
        });
        if (findPost === null) throw 'Post not found!';
        if (findPost.user_id !== req.auth.userId && !isModeration) {
            throw 'Unauthorized request!';
        }

        // Si pr??sence image on en d??finit l'url
        const postObject = req.file ?
        {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body.post };

        // Validation du formulaire
        validatePostPayload(postObject);

        // Si ancienne image, on la supprime si nouvelle ou suppression
        if (findPost.image !== null && (req.file || postObject.imageUrl === null)) {
            const fileName = findPost.image.split('images/')[1];
            fs.unlink(`images/${fileName}`, (err) => {
                if (err) {
                    console.log('Image not found!');
                } else {
                    console.log(`Old image deleted (${fileName})`);
                }
            });
        }
        
        // Update content
        if (findPost.content !== postObject.content) {
            await Post.update({ content: postObject.content }, { where: {id: postId} }, (err) => {
                if (err) throw err;
            });
        }
        // Update image
        if (findPost.image !== postObject.imageUrl) {
            await Post.update({ image: postObject.imageUrl }, { where: {id: postId } }, (err) => {
                if (err) throw err;
            });
        }
        // Personnalisation de message sur le front si mod??ration
        if (isModeration && findPost.User.rank < 2) {
            await Post.update({ moderator: isModeration }, { where: {id: postId} }, (err) => {
                if (err) throw err;
            });
        }
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

        // V??rification du rang de l'utilisateur. Si admin, il pourra supprimer le post
        const findUser = await User.findOne({ where: {id: req.auth.userId}, attributes: ['rank'] });
        let isModeration = null;
        if (findUser !== null && findUser.rank > 2) {
            isModeration = true;
        }

        // Recherche du post ?? supprimer
        const findPost = await Post.findOne({ 
            where: {id: postId},
            include: { model: User, attributes: ['rank'] }
        });
        if (findPost === null) throw 'Post not found!';
        else if (findPost.user_id !== req.auth.userId && !isModeration) {
            throw 'Unauthorized request!';
        }

        // Si image on r??cup??re son nom et on la supprime du serveur
        if (findPost.image !== null) {
            const fileName = findPost.image.split('images/')[1];
            fs.unlink(`images/${fileName}`, (err) => {
                if (err) {
                    console.log('Image not found!');
                } else {
                    console.log(`Old image deleted (${fileName})`);
                }
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

// Fonction pour le syst??me de like d'un post
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
        // Sinon, on met ?? jour like_value
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