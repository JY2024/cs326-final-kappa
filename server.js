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
app.use(bodyParser.urlencoded({
    parameterLimit: 200000,
    limit: '100mb',
    extended: true
  }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

// Linking pages together
    // Home Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/index.html'));
});
    // Login
app.post('/login', async (req, res) => {
    const ret = await db.authUserObj(req); 
    if(ret.status === "ERROR"){
        res.sendFile(path.join(__dirname, '/webPages/htmlFiles/incorrectLogin.html'));
    }
    else{
        res.sendFile(path.join(__dirname, '/webPages/htmlFiles/main-feed.html'));
    }
});
    // Log Out
app.get('/logout.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/index.html'));
});
// Recipe
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
    // To Main Feed (Uh Oh)
app.get('/uhoh.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/uhoh.html'));
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
app.post('/user/new', createUser);
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

// [3] Like Functions
app.post('/recipe/like/new', async (req, res) =>       {res.send(await createLike(req, res));   });
app.post('/recipe/like/delete', async (req, res) =>    {res.send(await deleteLike(req, res));    });

// [4] Comment Functions
app.post('/recipe/comment/new', createComment);

app.get('/comment/read?:id', async (req,res) =>{
    console.log("getting comments for recipe: ", req.query.recipe_id);
    res.send(await db.getCommentInfo(req.query.recipe_id));
});

app.post('recipe/comment/update', async (req, res) => {
    res.send(await db.updateCommentObj(req.body['commentID'], req.body['text']));
})

app.post('/recipe/comment/delete', deleteComment);

// [5] Chat Functions
app.get('/chat/new?:id', async (req, res) => {
    const result = await db.createChat(req.query.sender, req.query.reciever);
    res.send(result);
    res.end();
});
app.get('/chat/list?:id', async (req, res) => {
    // const result = await db.getChat(req.query.user);
    // res.send(result);
    res.send(await db.getChat(req.query.user));
    res.end();
});
app.post('/chat/update', async (req,res) =>{
    const chat = await db.getMessageID(req.body.sender, req.body.reciever);
    res.send(await db.updateChat(req.body.sender, chat, req.body.text));
    res.end();
});

// [6] Message Functions
app.get('/message/view?:id', async (req, res) => {
    console.log('sender and reciever', req.query.sender, req.query.reciever);
    const chat = await db.getMessageID(req.query.sender, req.query.reciever);
    res.send(await db.getMessages(chat));
    res.end();
});

// FUNCTIONS

// USER FUNCTIONS
async function createUser(req, res) {
    await db.createUserObj(req.body.username, req.body.password, req.body.displayName);
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/main-feed.html'));
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
    const result = await db.updateUser(req.body['username'], req.body['profile_picture'], req.body['location'], req.body['preferences'], req.body['description'], req.body['display_name']);
    res.send(result);
    res.end();
} 
async function updateUserPass(req, res) {
    const result = await db.updateUserPass(req.body['username'], req.body['password']);
    res.send(result);
    res.end();
}
// delete user object
async function deleteUser(req, res){
    const result = await db.deleteUserObj(req.body.username);
    res.send(result);
    res.end();
}

// RECIPE FUNCTIONS
async function createRecipe(req, res){
    // ex. /recipe/new
    // POST {title: recipeName, author: author, ingredients:ingredients, instructions:instructions}
    // JSON status returned
    console.log(req);
    res.send(await db.createRecipeObj(req.body.title, req.body.author, req.body.ingredients, req.body.instructions, req.body.preferences, req.body.time, req.body.recipe_picture, req.body.tips));
    res.end();
}
async function readRecipe(req, res) {
    if (parseInt(req.query.recipeID) === 0) {
        const result = await db.getRandomRecipe(req.query.username);
        res.send(result);
    } else {
        const result = await db.getRecipeInfo(req.query.recipeID);
        res.send(result);
    }
    res.end();
}
// LIKE FUNCTIONS
async function createLike(req, res){
    res.send(await db.createLikeObj(req.body.username, req.body.recipe_id));
    res.end();
}
async function deleteLike(req, res){
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
    console.log(`Example app listening on port ${port}`);
});