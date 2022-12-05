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
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
    parameterLimit: 200000,
    limit: '100mb',
    extended: true
  }));
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
app.get('/login?:query', async (req, res) => {
    console.log('user tried to login');
    const ret = await db.authUserObj(req); 
    console.log("recieved status update ", ret.status);
    if(ret.status === "ERROR"){
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
    res.send(db.tempGetRecipeInfo(req.query.recipeID));
    res.end();
});
app.get('/recipe.html', (req, res) => {
    console.log('recipe check');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/recipe.html'));
});
//Chat Page
app.get('/chat.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/chat.html'));
});
    // To Main Feed
app.get('/main-feed.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/main-feed.html'));
});
    // To Profile Page
app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile.html'));
});
    // For Images
app.get('/images/:imageid', (req, res) => {
    console.log(req.params.imageid);
    res.sendFile(path.join(__dirname, '/webPages/images/', req.params.imageid));
});
    // For CSS
app.get('/CSSFiles/:cssid', (req, res) => {
    res.sendFile(path.join(__dirname, '/webPages/CSSFiles/', req.params.cssid));
});
    // For JS Files
app.get('/jsFiles/:jsid', (req, res) => {
    res.sendFile(path.join(__dirname, '/webPages/jsFiles/', req.params.jsid));
});
    // To Settings: Personal Info
app.get('/profile-settings-personal-info.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile-settings-personal-info.html'));
});
    // To Settings: Profile Display
app.get('/profile-settings-profile-display.html', (req, res) => {
    console.log('display check');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile-settings-profile-display.html'));
});
    // To Settings: Security
app.get('/profile-settings-security.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile-settings-security.html'));
});
// [1] User Functions
app.get('/user/new', createUser);
app.get('/user/read', readUser);
app.post('/user/update', updateUser);
app.post('/user/updatePass', updateUserPass);
app.post('/user/delete', deleteUser);

// [2] Recipe Functions
app.post('/recipe/new', createRecipe);
app.get('/recipe/delete', (req, res) => {   res.send(deleteRecipe(req, res));   });
app.get('/recipe/read', readRecipe);
app.get('/recipe/list/my', async (req, res) => {res.send(await readMyRecipes(req, res));});
app.get('/recipe/list/saved', async (req, res) => {res.send(await readSavedRecipes(req, res));     });
app.get('/recipe/detail', (req, res) => {    res.send(readRecipe(req, res));    });
// app.get('/recipe/tempread', tempReadRecipe);

// [3] Like Functions
app.post('/recipe/like/new', async (req, res) =>       {res.send(await createLike(req, res));   });
app.post('/recipe/like/delete', async (req, res) =>    {res.send(await deleteLike(req, res));    });


// [4] Comment Functions
app.post('/recipe/comment/new', createComment);
app.get('/comment/read', async (req,res) =>{
    res.send(await db.getCommentInfo(req.query.comment_id));
});
app.post('recipe/comment/update', async (req, res) => {
    res.send(await db.updateCommentObj(req.body['commentID'], req.body['text']));
})
app.get('/recipe/comment/delete', deleteComment);


// [5] Chat Functions
app.post('/chat/new?:id', async (req, res) => {
    console.log('user ', req.query.sender, 'conversing with ', req.query.reciever);
    const result = db.createChat(req.query.sender, req.query.reciever);
    res.send(result);
    res.end();
});
app.get('/chat/list?:id', async (req, res) => {
    console.log('user ', req.query.user);
    const result = await db.getChat(req.query.user);
    res.send(result);
    res.end();
});


// [6] Message Functions
app.get('/message/view?:id', async (req, res) => {
    console.log('user ', req.query.user);
    const result = await db.getMessages('129478129');
    res.send(result);
    res.end();
});

// FUNCTIONS

// USER FUNCTIONS
async function createUser(req, res) {
    const result = await db.createUserObj(req.query.username, req.query.password, req.query.displayName);
    res.send(result);
    res.end();
}
async function readUser(req, res) {
    const result = await db.getUserInfo(req.query.username);
    res.send(result);
    res.end();
}
async function readMyRecipes(req, res){
    return await db.getMyRecipes(req.query.username);
}
async function readSavedRecipes(req, res){
    return await db.getSavedRecipes(req.query.username);
}
async function updateUser(req, res) {
    const result = await db.updateUser(req.body['username'], req.body['profile_picture'], req.body['location'], req.body['preferences'], req.body['description'], req.body['hide_recipes'], req.body['display_name']);
    res.send(result);
    res.end();
} 
async function updateUserPass(req, res) {
    const result = await db.updateUserPass(req.body['username'], req.body['password']);
    res.send(result);
    res.end();
}
async function deleteUser(req, res) {
    const result = await db.deleteUserObj(req.body['username']);
    res.send(result);
    res.end();
}

// RECIPE FUNCTIONS
async function createRecipe(req, res) {
    res.send(await db.createRecipeObj(req.body.title, req.body.author, req.body.ingredients, req.body.instructions, req.body.preferences, req.body.time));
    res.end();
}
async function readRecipe(req, res) {
    if (parseInt(req.query.recipeID) === 0) {
        res.send(await db.getRandomRecipe(req.query.username));
    } else {
        const result = await db.getRecipeInfo(req.query.recipeID);
        res.send(result);
    }
    res.end();
}

function deleteRecipe(req, res){
    // ex. /recipe/delete?recipeID=1234&username=jay1024
    return db.deleteRecipeObj(req.query.recipeID, req.query.username);
}

    // LIKE
async function createLike(req, res){
    // ex. /recipe/like/new?sender=jay1024&recipeID=1234
    res.send(await db.createLikeObj(req.body.username, req.body.recipe_id));
    res.end();
    }

async function deleteLike(req, res){
    // ex. /recipe/like/delete?sender=jay1024&recipeID=1234
    res.send(await db.deleteLikeObj(req.body.username, req.body.recipe_id));
    res.end();
}

// COMMENTS FUNCTIONS
async function createComment(req, res){
    const result = await db.createCommentObj(req.body.sender, req.body.recipeID, req.body.text);
    res.send(result);
    res.end();
}
async function readComment(req, res) {
    const result = await db.getCommentInfo(req.query.comment_id);
    res.send(result);
    res.end();
}
async function updateComment(req, res) {
    const result = await db.updateCommentObj(req.body['comment_id'], req.body['text']);
    res.send(result);
    res.end();
}
async function deleteComment(req, res){
    const result = await db.deleteCommentObj(req.body['commentID']);
    res.send(result);
    res.end();
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`); // for debugging
});