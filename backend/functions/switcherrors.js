/**
 * @description This function allows to return a status code according to the error
 * 
 * @param {Response} res the response to send
 * @param {String} err the error to be processed
 **/
const switchErrors = (res, err) => {
    let statusCode;
    switch(err) {
        case 'An error has occurred!':
            statusCode = 500;
            break;
        case 'Please validate your account first, check your email box!':
            statusCode = 422;
            break;
        case 'No post found!':
        case 'Post not found!':
        case 'Comment not found!':
        case 'No comments found':
        case 'User not found!':
            statusCode = 404;
            break;
        case 'Unauthorized request!':
            statusCode = 403;
            break;
        case 'User already connected!':
        case 'User already disconnected!':
        case 'Wrong password!':
        case 'Unauthenticated user!':
        case 'You are not logged in!':
            statusCode = 401;
            break;
        default:
            statusCode = 400;
    }
    res.status(statusCode).json({ err });
};

module.exports = switchErrors;