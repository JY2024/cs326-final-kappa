import { createUserObj, createCommentObj, existsUser, existsRecipe, updateCommentObj, updateDescriptionObj, 
    updateLocationObj, updateProfilePictureObj, existsComment, deleteUserObj, deleteCommentObj, getUserInfo, getCommentInfo, 
    createChatObj, getMessageHistory, updateChat, deleteChatObj} from './database.js';
// Utility Functions

// function parse(url) {
//     const queryComponents = url.split('/')[2].split('?')[1].split('&');
//     const queryObj = {};
//     for (const str of queryComponents) {
//         queryObj[str.split('=')[0]] = str.split('=')[1];
//     }
//     return queryObj;
// }

const express = require('express');
const app = express();
const PORT = 8080;
app.use(express.json());

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
function createUserErrorHandler(req, res, next) {
    // On creation, user has username, password, and display name
    // ex. /user/new?username=jay1024&password=123&displayName=Jay
    const exists = existsUser(req.params.username);
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
function readUserErrorHandler(req, res, next) {
    // ex. /user/read?username=Jay1024
    const exists = existsUser(req.params.username);
    if (!exists) {
        sendError(res, 'user-nonexistent');
    } else {
        next();
    }
}
// OTHER FUNCTIONS FOR UPDATE USER INFO
function updateProfilePicture(req, res) {
    // ex. /user/update?username=Jay1024
    // req.body contains {img: some image information}
    // ADD: update image functionality
    updateProfilePictureObj(req.params.username, req.params.path, req.body.blob);
}
function updateProfilePictureErrorHandler(req, res, next) {
    // ex. /user/update?username=Jay1024
    // req.body contains {img: some image information}
    // ADD: error handling for images (size constraints?)
    next();
}
function updateLocation(req, res) {
    // ex. /user/update?username=Jay1024
    // req.body contains {location: string}
    updateLocationObj(req.body.location);
    res.end();
}
function updateLocationErrorHandler(req, res, next) {
    // ex. /user/update?username=Jay1024
    // req.body contains {location: string}
    if (req.body.location.length === 0) {
        sendError(res, 'location-length'); // NOTE: maybe should change this to use express to send error message, but I don't know how right now...
    } else {
        next();
    }
}
function updatePreferences(req, res) {
    // ex. /user/update?username=Jay1024
    // req.body contains {preference1: something, preference2: something}
    updatePreferencesObj(req.body);
    res.end();
}
function updatePreferencesErrorHandler(req, res, next) {
    // ex. /user/update?username=Jay1024
    // req.body contains {preference1: something, preference2: something}
    const exists = existsUser(req.params.username);
    if (!exists) {
        sendError(res, 'user-nonexistent');
    } else {
        next();
    }
}
function updateDescription(req, res) {
    // ex. /user/update?username=Jay1024
    // req.body contains {description: string}
    updateDescriptionObj(req.body.description);
    res.end();
}
function updateDescriptionErrorHandler(req, res, next) {
    // ex. /user/update?username=Jay1024
    // req.body contains {description: string}
    if (req.body.description.length === 0) {
        sendError(res, 'description-length'); // NOTE: maybe should change this to use express to send error message, but I don't know how right now...
    } else {
        next();
    }
}

function deleteUser(req, res) {
    // ex. /user/delete?username=Jay1024
    deleteUserObj(req.params.username);
    res.redirect('./homepage.html'); // NOTE: or whatever we end up calling it
    res.end();
}
function deleteUserErrorHandler(req, res, next) {
    // ex. /user/delete?username=Jay1024
    const exists = existsUser(req.params.username);
    if (!exists) {
        sendError(res, 'user-nonexistent');
    } else {
        next();
    }
}

//REST Commands
//POST– This creates a new record in the database.
// GET– This request reads information sourced from a database.
// PUT/PATCH– This updates an object.
// DELETE– This removes a record from the database.
// CRUD Commands
// CREATE– This creates a new record through INSERT statements. In REST, this is a POST command. 
// READ/RETRIEVE– These procedures grab data based on input parameters. In REST, this is equivalent to a GET command.
// UPDATE– This updates data without overwriting it. In REST, this is a PUT request. 
// DELETE- This removes data from the database. REST uses the same request to delete data. 




// Comments
function createComment(req, res) {
    // ex. /recipe/id/comment/new?sender=Jay1024&recipe=Bella12-38463 ... req.body contains the text
    createCommentObj(req.params.sender, req.params.recipe.split('-')[0], req.params.recipe.split('-')[1], req.body.text);
    res.end();
}
function createCommentErrorHandler(req, res, next) {
    // Comment has user who created it, recipe linked to comment, comment text
    // ex. /recipe/id/comment/new?sender=Jay1024&recipe=Bella12-38463 ... req.body contains the text
    // This is assuming that the other user allows comments
    const recipeComponents = req.params.recipe.split('-');
    const exists = existsRecipe(recipeComponents[0], recipeComponents[1]);
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
function readCommentErrorHandler(req, res, next) {
    // ex. /recipe/id/comment/read?comment_id=03948774
    const exists = existsComment(req.query.comment_id);
    if (!exists) {
        sendError(res, 'comment-nonexistent');
    } else {
        next();
    }
}
function updateComment(req, res) {
    // ex. /recipe/id/comment/update?comment_id=03948774
    // req.body contains new text
    updateCommentObj(req.params.comment_id, req.body.text);
    res.end();
}
function updateCommentErrorHandler(req, res, next) {
    // ex. /recipe/id/comment/update?comment_id=03948774
    // req.body contains new text
    const exists = existsComment(comment_id);
    if (!exists) {
        sendError(res, 'comment-nonexistent');
    } else if (req.body.text.length === 0) {
        sendError(res, 'comment-length');
    } else {
        next();
    }
}
function deleteComment(req, res) {
    // ex. /recipe/id/comment/delete?comment_id=03948774
    const recipeInfo = readComment(req.params.comment_id);
    deleteCommentObj(req.params.comment_id);
    // ADD: update the page to reflect the changes (the same page but without the deleted comment) -- maybe serve the page again?
    res.end();
}
function deleteCommentErrorHandling(req, res, next) {
    // ex. /recipe/id/comment/delete?comment_id=03948774
    const exists = existsComment(req.params.comment_id);
    if (!exists) {
        sendError(res, 'comment-nonexistent');
    } else {
        next();
    }
}

//Chat Page
function createChat(req, res){
    //ex. /chat/new?sender=daktshh&reciever=Jay1024
    createChatObj(req.query.sender, req.query.reciever, req.body.text);
    res.end();
}
function createChatHandler(req, res, next) {
    // Comment has user who created it, recipe linked to comment, comment text
    // ex. /recipe/id/comment/new?sender=Jay1024&recipe=Bella12-38463 ... req.body contains the text
    // This is assuming that the other user allows comments
    const exists = existsUser(req.params.reciever);
    if (!exists) {
        sendError(res, 'user-nonexistent');
    } else if (req.body.text.length === 0) {
        sendError(res, 'message-length');
    } else {
        next();
    }
}
function readChat(req, res) {
    // ex. /chat/read?user=daktshh&reciever=temp
    const messages = getMessageHistory(req.query.user, req.query.reciever);
    res.json(messages); // NOTE: Might not end up being JSON
    res.end();
}
function readChatErrorHandler(req, res, next) {
    // ex. /chat/read?user=daktshh&reciever=temp
    const exists = existsUser(req.query.reciever);
    const messages = getMessageHistory(req.query.user, req.query.reciever);
    if (!exists) {
        sendError(res, 'cousermment-nonexistent');
    } else if(Object.keys(messages).length === 0) {
        sendError(res, 'Start a new chat with this user!');
    } else {
        next();
    }
}
function updateChat(req, res) {
    // ex. /chat/update?user=daktshh&reciever=temp
    updateChat(req.query.user, req.query.reciever, req.body.text);
    res.end();
}
function updateChatErrorHandler(req, res, next) {
    // ex. /chat/update?user=daktshh&reciever=temp
    const exists = existsUser(req.query.reciever);
    if (!exists) {
        sendError(res, 'user-nonexistent');
    } else {
        next();
    }
}
function deleteChat(req, res) {
    // ex. /chat/delete?user=daktshh&reciever=temp
    deleteChatObj(req.query.user, req.query.reciever);
    // ADD: update the page to reflect the changes (the same page but without the deleted comment) -- maybe serve the page again?
    res.end();
}
function deleteChatErrorHandler(req, res, next) {
    // ex. /chat/delete?user=daktshh&reciever=temp
    const exists = existsUser(req.params.reciever);
    if (!exists) {
        sendError(res, 'user-nonexistent');
    } else {
        next();
    }
}