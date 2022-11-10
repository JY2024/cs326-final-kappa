//Require and import cannot be used together so esm is used to get database.js
//npm install esm
// const esm = require('esm')(module);
// const db = esm('./database.js');
// const cors = require('cors');
import bodyParser from "body-parser";
import express, { response } from 'express'
import * as db from './database.js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

//ROUTES, NOTE: TEST AND THEN ADD MORE ROUTES AS NEEDED
// Linking pages together
    // Home Page
app.get('/', (req, res) => {
    console.log('At home');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/index.html'));
});
    // Login
app.get('/login?:query', (req, res) => {
    console.log('user tried to login');
    const ret = db.authUserObj(req); 
    console.log("recieved status update ", ret.Status);
    if(ret.Status === "ERROR"){
        res.sendFile(path.join(__dirname, '/webPages/htmlFiles/incorrectLogin.html'));
    }
    else{
        res.sendFile(path.join(__dirname, '/webPages/htmlFiles/main-feed.html'));
    }
});
    // To Main Feed
app.get('/main-feed.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/main-feed.html'));
});
    // To Profile Page
app.get('/profile.html', (req, res) => {
    console.log('new');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile.html'));
});
    // For Images
app.get('/images/:imageid', (req, res) => {
    console.log(req.params.imageid);
    res.sendFile(path.join(__dirname, '/webPages/images/', req.params.imageid));
});
    // For CSS
app.get('/CSSFiles/:cssid', (req, res) => {
    console.log(req.params.cssid);
    res.sendFile(path.join(__dirname, '/webPages/CSSFiles/', req.params.cssid));
});
    // For JS Files
app.get('/jsFiles/:jsid', (req, res) => {
    console.log(req.params.jsid);
    res.sendFile(path.join(__dirname, '/webPages/jsFiles/', req.params.jsid));
});
    // To Settings: Personal Info
app.get('/profile-settings-personal-info.html', (req, res) => {
    console.log('profile check');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile-settings-personal-info.html'));
});
    // To Settings: Profile Display
app.get('/profile-settings-profile-display.html', (req, res) => {
    console.log('display check');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile-settings-profile-display.html'));
});
    // To Settings: Privacy
app.get('/profile-settings-privacy.html', (req, res) => {
    console.log('privacy check');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile-settings-privacy.html'));
});
    // To Settings: Security
app.get('/profile-settings-security.html', (req, res) => {
    console.log('security check');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile-settings-security.html'));
});
// [1] User Functions
app.get('/user/new', [createUserErrorHandler, createUser]);
// app.get('/user/new', (req, res) => {        res.send(createUser(req, res)); });
app.get('/user/delete', (req, res) => {     res.send(deleteUser(req, res)); });

// [2] Recipe Functions
//app.post('/recipe/new', (req, res) => {     res.send(createRecipe(req, res));   });
app.post('/recipe/new', [createRecipeErrorHandler, createRecipe]);
app.get('/recipe/delete', (req, res) => {   res.send(deleteRecipe(req, res));   });
app.get('/recipe/read', [readRecipeErrorHandler, readRecipe]);
// app.get('/recipe/read', (req, res) => {   res.send(readRecipe(req, res));   });
app.get('/recipe/list/my', (req, res) => {     res.send(readMyRecipes(req, res));     });
app.get('/recipe/list/saved', (req, res) => {     res.send(readSavedRecipes(req, res));     });
app.get('/recipe/detail', (req, res) => {    res.send(readRecipe(req, res));    });

// [3] Like Functions
app.get('/recipe/like/new', (req, res) =>       {res.send(createLike(req, res));   });
app.get('/recipe/like/delete', (req, res) =>    {res.send(deleteLike(req, res));    });

// [4] Comment Functions
app.post('/recipe/comment/new', (req, res) =>    {res.send(createComment(req, res));    });
app.get('/recipe/comment/delete', (req, res) => {res.send(deleteComment(req, res));    });

// [5] Chat Functions


// [6] Message Functions


// FUNCTIONS

    // USER FUNCTIONS
// create new user
function createUser(req, res) {
    // ex. /user/new?username=jay1024&password=123&displayName=Jay
    if (req.query.username == undefined ||
        req.query.password == undefined ||
        req.query.displayName == undefined) {
        return {Status: 'ERROR', Username: req.query.username, errMessage: 'Incomplete information'}
    }
    res.send(db.createUserObj(req.query.username, req.query.password, req.query.displayName));
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
// read user info, NOTE: TEST AND THEN FIX THE ROUTES AT THE TOP TO INCLUDE ERROR HANDLERS
function readUser(req, res) {
    // ex. /user/read?username=Jay1024
    res.send(getUserInfo(req.query.username));
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
function readMyRecipes(req, res){
    // ex. /recipe/list/my?username=jay1024

    return db.getMyRecipes(req.query.username);
}

function readSavedRecipes(req, res){
    // ex. /recipe/list/saved?username=jay1024
    return db.getSavedRecipes(req.query.username);
}
// update user info
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
        // sendError(res, 'description-length'); // NOTE: maybe should change this to use express to send error message, but I don't know how right now...
        res.write(JSON.stringify({ result : 'error'}));
    } else {
        next();
    }
}
// delete user object
function deleteUser(req, res){
    // ex. /user/delete?username=jay1024
    return db.deleteUserObj(req.query.username);
}

    // RECIPE, NOTE: NEED ERROR HANDLERS, MAYBE UPDATE FUNCTIONALITY
function createRecipe(req, res){
    // ex. /recipe/new
    // POST {title: recipeName, author: author, ingredients:ingredients, instructions:instructions}
    // JSON status returned
    res.send(db.createRecipeObj(req.body.title, req.body.author, req.body.ingredients, req.body.instructions));
    res.end();
}

function createRecipeErrorHandler(req, res, next) {
    // On creation, recipe has title, author, ingredients, instructions, preferences, time
    const exists = db.existsRecipe(req.body.title,req.body.author);
    if (exists) {
        sendError(res, 'exists-recipe');
    } else {
        next();
    }
}

function readRecipe(req, res) {
    console.log('entered readRecipe');
    // ex. /recipe/read?recipeID=1234
    console.log('req query recipe id is ' + req.query.recipeID);
    res.send(db.getRecipeInfo(req.query.recipeID));
    res.end();
}

function readRecipeErrorHandler(req, res, next) {
    if (false) {
        console.log('entered recipe error handler');
        // sendError(res, 'description-length'); // NOTE: maybe should change this to use express to send error message, but I don't know how right now...
        res.send(JSON.stringify({ result : 'error'}));
    } else {
        console.log('entered other part');
        next();
    }
}

function deleteRecipe(req, res){
    // ex. /recipe/delete?recipeID=1234&username=jay1024
    return db.deleteRecipeObj(req.query.recipeID, req.query.username);
}

    // LIKE
function createLike(req, res){
    // ex. /recipe/like/new?sender=jay1024&recipeID=1234
    return db.createLikeObj(req.query.sender, req.query.recipeID);
}

function deleteLike(req, res){
    // ex. /recipe/like/delete?sender=jay1024&recipeID=1234
    return db.deleteLikeObj(req.query.sender, req.query.recipeID);
}

    // COMMENTS
function createComment(req, res){
    // ex. /comment/new
    return db.createCommentObj(req.body.sender, req.body.recipeID, req.body.text);
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
function deleteComment(req, res){
    // ex. /comment/delete?sender=jay1024&recipeID=1234
    return db.deleteCommentObj(req.query.sender, req.query.recipeID);
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

    // CHAT


    // MESSAGE

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`); // for debugging
});