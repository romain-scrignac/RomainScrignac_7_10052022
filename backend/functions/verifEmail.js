const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const verifEmail = (userEmail, userFirstname, userCode) => {
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // send mail with defined transport object
        const mailConfigurations = {
            from: '"Groupomania" <groupomania.verif@gmail.com>',
            to: userEmail,
            subject: "Vérification d'email ✔",
            text: `Bienvenue ${userFirstname} !
                Veuillez trouver ci-dessous votre code de confirmation afin de finaliser la création de votre compte.
                Code:  ${userCode}
                
                L'équipe de Groupomania`,
            html: `<p>Bienvenue <b>${userFirstname}</b> !</p>
                <p>Veuillez trouver ci-dessous votre code de confirmation afin de finaliser la création de votre compte.</p>
                <p><u>Code:</u>  <b>${userCode}</b></p>
                <p></p>
                <p><i>L'équipe de Groupomania</i></p>`
        };

        transporter.sendMail(mailConfigurations, function(error, info){
            if (error) throw error;
            console.log('Email Sent Successfully');
            console.log(info);
        });
    } catch (err) {
        console.error(err);
    }
};

module.exports = verifEmail;