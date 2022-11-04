import { createUserObj, createCommentObj, existsUser, existsRecipe, existsComment, deleteUserObj, deleteCommentObj, getUserInfo} from './database.js';
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
    return /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/.test();
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
    // ex. /user/new?username=jay1024&password=123&displayName=Jay
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
function readUser(req, res) {
    // ex. /user/read?username=Jay1024
    const info = getUserInfo(req.query.username);
    res.json(info); // NOTE: it may not end up being in JSON format already; in that case, it needs to be converted
    res.end();
}
async function readUserErrorHandler(req, res, next) {
    // ex. /user/read?username=Jay1024
    const exists = await existsUser(req.params.username);
    if (!exists) {
        sendError(res, 'user-nonexistent');
    } else {
        next();
    }
}
function updateUser(req, res) {

}
function updateUserErrorHandler(res, res, next) {

}
function deleteUser(req, res) {
    // ex. /user/delete?username=Jay1024
    deleteUserObj(req.params.username);
    res.redirect('./homepage.html'); // NOTE: or whatever we end up calling it
    res.end();
}
async function deleteUserErrorHandler(req, res, next) {
    // ex. /user/delete?username=Jay1024
    const exists = await existsUser(req.params.username);
    if (!exists) {
        sendError(res, 'user-nonexistent');
    } else {
        next();
    }
}

// Comments
function createComment(req, res) {
    // ex. /recipe/id/comment/new?sender=Jay1024&recipe=Bella12-38463 ... req.body contains the text
    createCommentObj(req.params.sender, req.params.recipe.split('-')[0], req.params.recipe.split('-')[1], req.body.text);
    res.end();
}
async function createCommentErrorHandler(req, res, next) {
    // Comment has user who created it, recipe linked to comment, comment text
    // ex. /recipe/id/comment/new?sender=Jay1024&recipe=Bella12-38463 ... req.body contains the text
    // This is assuming that the other user allows comments
    const recipeComponents = req.params.recipe.split('-');
    const exists = await existsRecipe(recipeComponents[0], recipeComponents[1]);
    if (!exists) {
        sendError(res, 'recipe-nonexistent');
    } else if (req.body.text.length === 0) {
        sendError(res, 'comment-length');
    } else {
        next();
    }
}
function readComment(req, res) {
    // ex. /recipe/id/comment/read?comment_id=03948774
    const info = getCommentInfo(req.query.comment_id);
    res.json(info); // NOTE: Might not end up being JSON
    res.end();
}
async function readCommentErrorHandler(req, res, next) {
    // ex. /recipe/id/comment/read?comment_id=03948774
    const exists = await existsComment(req.query.comment_id);
    if (!exists) {
        sendError(res, 'comment-nonexistent');
    } else {
        next();
    }
}
function updateComment() {

}
function deleteComment(req, res) {
    // ex. /recipe/id/comment/delete?comment_id=03948774
    const recipeInfo = readComment(req.params.comment_id);
    deleteCommentObj(req.params.comment_id);
    // ADD: update the page to reflect the changes (the same page but without the deleted comment) -- maybe serve the page again?
    res.end();
}
async function deleteCommentErrorHandling(req, res, next) {
    // ex. /recipe/id/comment/delete?comment_id=03948774
    const exists = await existsComment(req.params.comment_id);
    if (!exists) {
        sendError(res, 'comment-nonexistent');
    } else {
        next();
    }
}