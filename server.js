import { createUserObj, existsUser} from './database.js';
// Utility Functions

// function parse(url) {
//     const queryComponents = url.split('/')[2].split('?')[1].split('&');
//     const queryObj = {};
//     for (const str of queryComponents) {
//         queryObj[str.split('=')[0]] = str.split('=')[1];
//     }
//     return queryObj;
// }
function containsSpecialChar(str) {
    return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test();
}
function containsNumber(str) {
    return /\d/.test();
}
//returns error as json to client, ends the response afterwards
//sendError(res: Response, errorMessage: string)
function sendError(res, errorMessage) {
    res.json({error: errorMessage});
    res.end();
}

// User
function createUser(req, res) {
    createUserObj(req.params.username, req.params.password, req.params.displayName);
    res.json({displayName: req.params.displayName});
    res.end();
}
async function createUserErrorHandler(req, res, next) {
    // On creation, user has username, password, and display name
    // ex. /user/new?username=jay1024&password=123&displayName=Jay
    const exists = await existsUser(req.params.username);
    if (req.params.username.length < 10 || req.params.username.length > 20) {
        sendError(res, 'username-length');
    } else if (req.params.password.length < 10) {
        sendError(res, 'password-length');
    } else if (!containsSpecialChar(req.params.password)) {
        sendError(res ,'password-special-char');
    } else if (!containsNumber(req.params.password)) {
        sendError(res, 'password-num');
    } else if (exists) {
        sendError(res, 'exists-username');
    } else {
        next();
    }
}
function updateUser() {
    
}

function deleteUser() {

}

// Comments
function createComment() {

}
function updateComment() {

}
function deleteComment() {

}