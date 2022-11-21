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
//Recipe Page
app.post('/recipe/view?:id', (req, res) => {
    console.log('user tried to see recipe: ', req.query.recipeID);
    db.updateCurrentRecipe(req.query.recipeID);
    res.send(db.getRecipeInfo(req.query.recipeID));
    res.end();
});
app.get('/recipe.html', (req, res) => {
    console.log('recipe check');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/recipe.html'));
});
//Chat Page
app.get('/chat.html', (req, res) => {
    console.log('new');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/chat.html'));
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
app.get('/user/new', createUser);
app.get('/user/read', readUser);
app.post('/user/update/:name', updateName);
app.post('/user/update/:location', updateLocation);
app.post('/user/update/:preferences', updatePreferences);
app.post('/user/update/:description', updateDescription);
app.post('/user/update/:recipe_hide', updateHideRecipe);
app.get('/user/delete', deleteUser);

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
app.get('/recipe/like/new', createLike);
app.get('/recipe/like/delete', deleteLike);

// [4] Comment Functions
app.post('/recipe/comment/new', createComment);
app.get('/recipe/comment/delete', deleteComment);
app.get('/comment/read?:id', (req,res) =>{
    console.log("IN HERE FOR COMMENT", req.query.comment_id);
    res.send(db.getCommentInfo(req.query.comment_id));
})
// [5] Chat Functions
app.post('/chat/new?:id', (req, res) => {
    console.log('user ', req.query.sender, 'conversing with ', req.query.reciever);
    res.send(db.createChat(req.query.sender, req.query.reciever));
    res.end();
});
app.get('/chat/list?:id', (req, res) => {
    console.log('user ', req.query.user);
    res.send(db.getChat(req.query.user));
    res.end();
});


// [6] Message Functions
app.get('/message/view?:id', (req, res) => {
    console.log('user ', req.query.user);
    res.send(db.getMessages(req.query.sender, req.query.reciever));
    res.end();
});

// FUNCTIONS

    // USER FUNCTIONS
// create new user
async function createUser(req, res) {
    // ex. /user/new?username=jay1024&password=123&displayName=Jay
    // if (req.query.username == undefined ||
    //     req.query.password == undefined ||
    //     req.query.displayName == undefined) {
    //     return {Status: 'ERROR', Username: req.query.username, errMessage: 'Incomplete information'}
    // }
    const result = await db.createUserObj(req.query.username, req.query.password, req.query.displayName);
    res.send(result);
    res.end();
}
// function createUserErrorHandler(req, res, next) {
//     // On creation, user has username, password, and display name
//     // ex. /user/new?username=jay1024&password=123&displayName=Jay
//     const exists = existsUser(req.params.username);
//     if (req.params.username.length < 10 || req.params.username.length > 20) {
//         sendError(res, 'username-length');
//     } else if (req.params.password.length < 10) {
//         sendError(res, 'password-length');
//     } else if (!containsSpecialChar(req.params.password)) {
//         sendError(res ,'password-special-char');
//     } else if (!containsNumber(req.params.password)) {
//         sendError(res, 'password-num');
//     } else if (exists) {
//         sendError(res, 'exists-username');
//     } else {
//         next();
//     }
// }
// read user info, NOTE: TEST AND THEN FIX THE ROUTES AT THE TOP TO INCLUDE ERROR HANDLERS
async function readUser(req, res) {
    // ex. /user/read?username=Jay1024
    const result = await db.getUserInfo(req.query.username);
    res.send(result);
    res.end();
}
// function readUserErrorHandler(req, res, next) {
//     // ex. /user/read?username=Jay1024
//     const exists = existsUser(req.params.username);
//     if (!exists) {
//         sendError(res, 'user-nonexistent');
//     } else {
//         next();
//     }
// }
async function readMyRecipes(req, res){
    const result = await db.getMyRecipes(req.query.username);
    res.send(result);
    res.end();
}

async function readSavedRecipes(req, res){
    const result = await db.getSavedRecipes(req.query.username);
    res.send(result);
    res.end();
}
// update user info
async function updateName(req, res) {
    const result = await db.updateName(req.body.name, req.body.username);
    res.send(result);
    res.end();
}
// function updateNameErrorHandler(req, res) {
//     if (req.body.name.length === 0) {
//         sendError(res, 'name-length'); // NOTE: maybe should change this to use express to send error message, but I don't know how right now...
//     } else {
//         next();
//     }
// }
async function updateLocation(req, res) {
    const result = await db.updateLocation(req.body.location, req.body.username);
    res.send(result);
    res.end();
}
async function updatePreferences(req, res) {
    const result = await db.updatePreferences(req.body.preferences, req.body.username);
    res.send(result);
    res.end();
}
// async function updateProfilePicture(req, res) {
//     // ex. /user/update?username=Jay1024
//     // req.body contains {img: some image information}
//     // ADD: update image functionality
//     const result = db.updateProfilePictureObj(req.params.username, req.params.path, req.body.blob);
//     res.send(result);
//     res.end();
// }
// async function updateProfilePictureErrorHandler(req, res, next) {
//     // ex. /user/update?username=Jay1024
//     // req.body contains {img: some image information}
//     // ADD: error handling for images (size constraints?)
//     next();
// }
// function updateLocationErrorHandler(req, res, next) {
//     // ex. /user/update?username=Jay1024
//     // req.body contains {location: string}
//     if (req.body.location.length === 0) {
//         sendError(res, 'location-length'); // NOTE: maybe should change this to use express to send error message, but I don't know how right now...
//     } else {
//         next();
//     }
// }
// function updatePreferencesErrorHandler(req, res, next) {
//     // ex. /user/update?username=Jay1024
//     // req.body contains {preference1: something, preference2: something}
//     const exists = existsUser(req.params.username);
//     if (!exists) {
//         sendError(res, 'user-nonexistent');
//     } else {
//         next();
//     }
// }
async function updateDescription(req, res) {
    // ex. /user/update?username=Jay1024
    // req.body contains {description: string}
    const result = await db.updateDescription(req.body.description, req.body.username);
    res.send(result);
    res.end();
}
// function updateDescriptionErrorHandler(req, res, next) {
//     // ex. /user/update?username=Jay1024
//     // req.body contains {description: string}
//     if (req.body.description.length === 0) {
//         // sendError(res, 'description-length'); // NOTE: maybe should change this to use express to send error message, but I don't know how right now...
//         res.write(JSON.stringify({ result : 'error'}));
//     } else {
//         next();
//     }
// }
async function updateHideRecipe(req, res) {
    const result = await db.updateHideRecipe(req.body.recipe_hide, req.body.username);
    res.send(result);
    res.end();
}
// delete user object
async function deleteUser(req, res){
    // ex. /user/delete?username=jay1024
    const result = await db.deleteUserObj(req.body.username);
    res.send(result);
    res.end();
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

async function readRecipe(req, res) {
    if (parseInt(req.query.recipeID) === 0) {
        res.send(db.getRandomRecipe(req.query.username));
    } else {
        const result = await db.getRecipeInfo(req.query.recipeID);
        res.send(result);
    }
    console.log('you made it to res.end');
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
async function createComment(req, res){
    // ex. /comment/new
    const result = await db.createCommentObj(req.body.sender, req.body.recipeID, req.body.text);
    res.send(result);
    res.end();
}
// function createCommentErrorHandler(req, res, next) {
//     // Comment has user who created it, recipe linked to comment, comment text
//     // ex. /recipe/id/comment/new?sender=Jay1024&recipe=Bella12-38463 ... req.body contains the text
//     // This is assuming that the other user allows comments
//     const recipeComponents = req.params.recipe.split('-');
//     const exists = existsRecipe(recipeComponents[0], recipeComponents[1]);
//     if (!exists) {
//         sendError(res, 'recipe-nonexistent');
//     } else if (req.body.text.length === 0) {
//         sendError(res, 'comment-length');
//     } else {
//         next();
//     }
// }
async function readComment(req, res) {
    // ex. /recipe/id/comment/read?comment_id=03948774
    const result = await db.getCommentInfo(req.query.comment_id);
    res.send(result);
    res.end();
}
// function readCommentErrorHandler(req, res, next) {
//     // ex. /recipe/id/comment/read?comment_id=03948774
//     const exists = existsComment(req.query.comment_id);
//     if (!exists) {
//         sendError(res, 'comment-nonexistent');
//     } else {
//         next();
//     }
// }
async function updateComment(req, res) {
    // ex. /recipe/id/comment/update?comment_id=03948774
    // req.body contains new text
    const result = await db.updateCommentObj(req.body.comment_id, req.body.text);
    res.send(result);
    res.end();
}
// function updateCommentErrorHandler(req, res, next) {
//     // ex. /recipe/id/comment/update?comment_id=03948774
//     // req.body contains new text
//     const exists = existsComment(comment_id);
//     if (!exists) {
//         sendError(res, 'comment-nonexistent');
//     } else if (req.body.text.length === 0) {
//         sendError(res, 'comment-length');
//     } else {
//         next();
//     }
// }
async function deleteComment(req, res){
    // ex. /comment/delete?sender=jay1024&recipeID=1234
    const result = await db.deleteCommentObj(req.body.commentID);
    res.send(result);
    res.end();
}
// function deleteCommentErrorHandling(req, res, next) {
//     // ex. /recipe/id/comment/delete?comment_id=03948774
//     const exists = existsComment(req.params.comment_id);
//     if (!exists) {
//         sendError(res, 'comment-nonexistent');
//     } else {
//         next();
//     }
// }

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`); // for debugging
});