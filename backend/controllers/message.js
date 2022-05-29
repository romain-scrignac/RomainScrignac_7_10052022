const { Message, User } = require('../database/models');
const { validateMessagePayload } = require('../functions/validateform');
const switchErrors = require('../functions/switcherrors');
const bcrypt = require('bcrypt');

// Fonction pour afficher un message
exports.getMessage = (req, res) => {
    try {
        if (req.auth || ! req.auth.userId) {
            throw 'Unauthorized request!';
        }

        const messageCrypt = await Message.findOne({ where: {message_id: req.params.id }});
        if (messageCrypt === null) throw 'Message not found!';
        if (messageCrypt.message_receiver_id !== req.auth.userId) {
            throw 'Unauthorized request!';
        }

        const senderMessage = await User.findOne({ where: messageCrypt.message_sender_id });
        if (senderMessage === null) throw 'Sender not found!';

        const firstName = senderMessage.user_firstname;
        const lastName = senderMessage.user_lastname;
        const email = senderMessage.user_email;

        // Décryptage du message//
        //......................//

        res.status(200).json({ Sender: `'${firstName} + ${lastName}'`, email: email, message: "Message décrypté!" });
    }catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour envoyer un message
exports.sendMessage = (req, res) => {
    try {
        if (req.auth || ! req.auth.userId) {
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

        // On crypte le message avant envoi
        const messageCrypt = await bcrypt.hash(content, 10);
        await Message.create({ message_content: messageCrypt, message_sender_id: senderId, message_receiver_id: receiverId }, (err) => {
            if (err) throw err;
        });
        await User.update({ user_message: + 1, where: {user_id: receiverId} }, (err) => {
            if (err) throw err;
        });

        res.status(200).json({  message: "Message sent!" });

    } catch (err) {
        switchErrors(res, err);
    }
};

// Fonction pour supprimer un message
exports.deleteMessage = (req, res) => {
    try {
        if (req.auth || ! req.auth.userId) {
            throw 'Unauthorized request!';
        }
        if (req.body || req.body.message) {
            throw 'Bad request!';
        }

        const messageId = req.body.messageId;
        const message = await Message.findOne({ where: {message_id: messageId} });
        if (message === null) throw 'Message not found!';
        if (message.message_receiver_id !== req.auth.userId) {
            throw 'Unauthorized request!';
        }

        await Message.destroy({ where: {message_id: messageId} }, (err) => {
            if (err) throw err;
        });
        res.status(200).json({ message: 'Message deleted!' });

    } catch (err) {
        switchErrors(res, err);
    }
};