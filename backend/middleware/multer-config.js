const multer = require('multer');
const { validatePostPayload } = require("../functions/validateform");

// Création dictionnaire pour les extensions
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];    // Création de l'extension
        const originalName = file.originalname.replace(extension, '').split('.')[0];
        const chars = /[À-ÿ!-/:-@[-`{-~]/g;    // Caractères indésirables pour un nom de fichier (Table Unicode/U0000)
        const fileName = originalName.replace(chars, '').toLowerCase().split(' ').join('+');
        callback(null, fileName + '_' + Date.now() + '.' + extension);
    }
});

module.exports = multer({
    storage,
    fileFilter: function (req, file, callback) {    

        let success = true;
        try {
            if (req.body.post != undefined) {
                const postObject = JSON.parse(req.body.post);
                validatePostPayload(req, postObject);   // Check du formulaire avant de sauvegarder l'image sur le serveur
            } else {
                success = false;
                callback(new Error("Invalid Form !"));
            }
        } catch (error) {
            success = false;
            callback(new Error(error));
        }
        
        // Vérification du format de l'image
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/gif') {
            success = false;
            callback({ message: "Invalid Image !" }, false);
        }

        if (success) {
            callback(null, true);
        }
    },
    limits: {   // Vérification du poids de l'image
        fileSize: 1024 * 1024
}}).single('image');