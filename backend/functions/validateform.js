/**
 * @description This function checks the validity of the post form
 * 
 * @param {Number} authId the user id of the token
 * @param {JSON | FormData} postObject the body of the request
 **/
const validatePostPayload = (authId, postObject) => {
    const regexVideoUrl = /^https?:\/\/$/;
    const {
        content,
        video,
        userId
    } = postObject;
    
    if (!postObject) {
        throw 'Bad request!';
    } else if (!content || !userId) {
        throw 'Invalid form !';
    } else if (typeof content !== "string" || (video && typeof video !== "string") 
    || typeof userId !== "string" || userId !== authId) {
        throw 'Invalid field(s)!';
    } else if (content.trim() === "" || userId.trim() === "") {
        throw 'Missing field(s)!';
    } else if (content.length < 3 || content.length >= 255) {
        throw 'Invalid number of characters!';
    } else if (video !== undefined && !video.match(regexVideoUrl)) {
        throw 'Bad video url!';
    }
};

/**
 * @description This function checks the validity of the comment form
 * 
 * @param {Number} authId the user id of the token
 * @param {JSON} commentObject the body of the request
 **/
 const validateCommentPayload = (authId, commentObject) => {
    const {
        content,
        userId,
        postId
    } = commentObject;

    if (!commentObject) {
        throw 'Bad request !';
    } else if (!content || !userId || !postId) {
        throw 'Invalid form !';
    } else if (typeof content !== "string" || typeof postId !== "number" 
    || typeof userId !== "string" || userId !== authId) {
        throw 'Invalid field(s)!';
    } else if (content.trim() === "" || userId.trim() === "" || postId === "") {
        throw 'Missing field(s)!';
    } else if (content.length < 3 || content.length >= 255) {
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
        verifPass
    } = userObject;
    
    if (!firstname || !lastname || !email || !password || !verifPass) {
        throw 'Invalid form!';
    } else if (typeof firstname !== 'string' || typeof lastname !== 'string' || typeof email !== 'string' 
    || typeof password !== 'string' || typeof verifPass !== 'string') {
        throw 'Invalid field(s)!';
    } else if (password !== verifPass) {
        throw 'Passwords do not match !';
    } else if (!email.match(regexEmail)) {
        throw 'Invalid email format!';
    } else if (!password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/[0-9]/)
    || password.length < 8) {
        throw 'Password not strong enough !';
    } else if (password.match(/\s|=|'|"/)) {
        throw 'Espaces, =, \' or " characters are not allowed!';
    }
};

/**
 * @description This function checks the validity of the message form
 * 
  * @param {JSON} userObject the body of the request
 **/
 const validateMessagePayload = (userObject) => {

 };

module.exports = { validatePostPayload, validateCommentPayload, validateUserPayload, validateMessagePayload };