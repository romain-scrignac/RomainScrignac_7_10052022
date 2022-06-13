const { Message, User } = require('../database/models');
const { validateMessagePayload } = require('../functions/validateform');
const switchErrors = require('../functions/switcherrors');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPT_KEY);
const url = require('url');

// Fonction pour afficher tous les messages
exports.getAllMessages = async (req, res) => {
    console.log(`userId: ${req.auth.userId}`)
    try {
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        }
        
        const messages = await Message.findAndCountAll({
            where: {receiver_id: req.auth.userId },
            include: { 
                model: User, 
                attributes: ['firstname', 'lastname'], 
                where: {id: req.auth.userId}
            }
        });
        if (messages === null) throw 'No message found!';

        res.status(200).json({ messages });
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour afficher un message
exports.getOneMessage = async (req, res) => {
    try {
        if (!req.auth || !req.auth.userId) {
            throw 'Unauthorized request!';
        }
        const messageId = req.params.id;
        console.log(messageId)

        const message = await Message.findOne({ where: {id: messageId} });
        if (message === null) throw 'Message not found!';
        if (message.receiver_id !== req.auth.userId) {
            throw 'Unauthorized request!';
        }

        const senderMessage = await User.findOne({ attributes: ['firstname', 'lastname'], where: {id: message.sender_id} });
        if (senderMessage === null) throw 'Sender not found!';

        // Décryptage du contenu du message
        const messageDecrypt = cryptr.decrypt(message.content);

        res.status(200).json({ sender: senderMessage, message: messageDecrypt, date: message.date });
    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour envoyer un message
exports.sendMessage = async (req, res) => {
    try {
        if (!req.auth || ! req.auth.userId) {
            throw 'Unauthorized request!';
        }
        if (req.body || req.body.message) {
            throw 'Bad request!';
        }

        const content = req.body.content;
        const senderId = req.auth.userId;
        const receiverId = req.body.receiverId;

        const messageObject = {
            senderId, 
            receiverId,
            content
        };

        validateMessagePayload(authId, messageObject);

        // On crypte le message avant sauvegarde dans la bdd
        const messageCrypt = cryptr.encrypt(content);

        await Message.create({ content: messageCrypt, sender_id: senderId, receiver_id: receiverId }, (err) => {
            if (err) throw err;
        });
        await User.update({ user_message: + 1, where: {id: receiverId} }, (err) => {
            if (err) throw err;
        });

        res.status(200).json({  message: "Message sent!" });

    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour supprimer un message
exports.deleteMessage = async (req, res) => {
    // try {
    //     if (!req.auth || ! req.auth.userId) {
    //         throw 'Unauthorized request!';
    //     }
    //     if (req.body || req.body.message) {
    //         throw 'Bad request!';
    //     }

    //     const messageId = req.body.messageId;
    //     const message = await Message.findOne({ where: {id: messageId} });
    //     if (message === null) throw 'Message not found!';
    //     if (message.receiver_id !== req.auth.userId) {
    //         throw 'Unauthorized request!';
    //     }

    //     await Message.destroy({ where: {id: messageId} }, (err) => {
    //         if (err) throw err;
    //     });
    //     res.status(200).json({ message: 'Message deleted!' });

    // } catch (err) {
    //     switchErrors(res, err);
    // }
};