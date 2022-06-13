const express = require('express');
const router = express.Router();
const mailboxCtrl = require('../controllers/mailbox');
const auth = require('../middleware/auth');

router.get('/', auth, mailboxCtrl.getAllMessages);                  // Requête pour récupérer tous les messages
router.get('/:id', auth, mailboxCtrl.getOneMessage);                // Requête pour récupérer un seul message
router.post('/', auth, mailboxCtrl.sendMessage);                    // Requête pour envoyer un message
router.delete('/message', auth, mailboxCtrl.deleteMessage);         // Requête pour supprimer un message

module.exports = router;