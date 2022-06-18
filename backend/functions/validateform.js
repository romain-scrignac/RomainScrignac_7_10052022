/**
 * @description This function checks the validity of the post form
 * 
 * @param {JSON | FormData} postObject the body of the request
 * @param {String} fileName name of the file if the validation comes from multer
 **/
const validatePostPayload = (postObject, fileName) => {
    const {
        content,
        imageUrl
    } = postObject;
    console.log(postObject);

    if (!postObject) {
        throw 'Bad request!';
    } else if (!content && !imageUrl && !fileName) {                // Si la publication ne contient rien
        throw 'Invalid form !';
    } else if (content && content.length < 3 && !imageUrl) {        // Si la publication ne contient pas d'image (création)
        throw 'Invalid number of characters!';
    } else if (content || content !== false) {                      // S'il y a du contenu (création + modification)
        if (typeof content !== "string") {
            throw 'Invalid field(s)!';
        } else if (content.trim() === "") { 
            throw 'Missing field(s)!';
        }
    }
};

/**
 * @description This function checks the validity of the comment form
 * 
 * @param {JSON} commentObject the body of the request
 **/
 const validateCommentPayload = (commentObject) => {
    const {
        content,
        postId
    } = commentObject;

    if (!commentObject) {
        throw 'Bad request !';
    } else if (!content || !postId) {
        throw 'Invalid form !';
    } else if (typeof content !== "string" || typeof postId !== "number") {
        throw 'Invalid field(s)!';
    } else if (content.trim() === "" || postId === "") {
        throw 'Missing field(s)!';
    } else if (content.length >= 255) {
        throw 'Invalid number of characters !';
    }
};

/**
 * @description This function checks the validity of the user form
 * 
  * @param {JSON} userObject the body of the request
 **/
 const validateUserPayload = (userObject) => {
    const regexEmail = /^([a-z0-9]{1,20})([\.|_|-]{1}[a-z0-9]{1,20})?@{1}([a-z0-9]{2,15})\.[a-z]{2,4}$/;
    const {
        firstname,
        lastname,
        email,
        password,
        confirmPass,
        signup
    } = userObject;

    if (signup) {
        if (!firstname || !lastname || !email || !password || !confirmPass) {
            throw 'Invalid form!';
        } else if (typeof firstname !== 'string' || typeof lastname !== 'string' || typeof email !== 'string' 
        || typeof password !== 'string' || typeof confirmPass !== 'string') {
            throw 'Invalid field(s)!';
        } else if (!email.match(regexEmail)) {
            throw 'Invalid email format!';
        } else if (password !== confirmPass) {
            throw 'Passwords do not match !';
        } else if (!password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/[0-9]/)
        || password.length < 8) {
            throw 'Password not strong enough !';
        } else if (password.match(/\s|=|'|"/)) {
            throw 'Espaces, =, \' or " characters are not allowed!';
        }
    } else {
        if ((firstname && typeof firstname !== 'string') || (lastname && typeof lastname !== 'string') || email && typeof email !== 'string'
        || (password && typeof password !== 'string' || typeof confirmPass !== 'string')) {
            throw 'Invalid field(s)!';
        } else if (email && !email.match(regexEmail)) {
            throw 'Invalid email format!';
        } else if (password && password !== confirmPass) {
            throw 'Passwords do not match !';
        } else if (password && (!password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/[0-9]/)
        || password.length < 8)) {
            throw 'Password not strong enough !';
        } else if (password && (password.match(/\s|=|'|"/))) {
            throw 'Espaces, =, \' or " characters are not allowed!';
        }
    }
};

module.exports = { validatePostPayload, validateCommentPayload, validateUserPayload };