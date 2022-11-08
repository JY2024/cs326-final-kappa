//README:
//Before running server.js be sure to have installed:
//npm install body-parser
//npm install bootstrap
//npm install cors
//npm install esm
//npm install express
//npm install http-server

const port = 8081
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const esm = require('esm')(module);
const db = esm('./database.js');
const cors = require('cors');
//Middle-ware.
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(bodyParser.text());
//app.use(express.urlencoded({ extended: false }));
//app.use(express.json)
app.listen(port);

//ROUTES
app.get('/', (req, res) => {
    console.log('At home');
});

app.get('/user/new', (req, res) => {        res.send(createUser(req, res)); });
app.get('/user/delete', (req, res) => {     res.send(deleteUser(req, res)); });

app.post('/recipe/new', (req, res) => {     res.send(createRecipe(req, res));   });
app.get('/recipe/delete', (req, res) => {   res.send(deleteRecipe(req, res));   });
app.get('/recipe/list/my', (req, res) => {     res.send(readMyRecipes(req, res));     });
app.get('/recipe/list/saved', (req, res) => {     res.send(readSavedRecipes(req, res));     });
app.get('/recipe/detail', (req, res) => {    res.send(readRecipe(req, res));    });

app.get('/recipe/like/new', (req, res) =>       {res.send(createLike(req, res));   });
app.get('/recipe/like/delete', (req, res) =>    {res.send(deleteLike(req, res));    });

app.post('/recipe/comment/new', (req, res) =>    {res.send(createComment(req, res));    });
app.get('/recipe/comment/delete', (req, res) => {res.send(deeleteComment(req, res));    });

function createUser(req, res) {
    // ex. /user/new?username=jay1024&password=123&displayName=Jay
    // JSON status returned
    if (req.query.username == undefined ||
        req.query.password == undefined ||
        req.query.displayName == undefined) {
        return {Status: 'ERROR', Username: req.query.username, errMessage: 'Incomplete information'}
    }
    return db.createUserObj(req.query.username, req.query.password, req.query.displayName);
}

function deleteUser(req, res){
    // ex. /user/delete?username=jay1024
    return db.deleteUserObj(req.query.username);
}

function createRecipe(req, res){
    // ex. /recipe/new
    // POST {title: recipeName, author: author, ingredients:ingredients, instructions:instructions}
    // JSON status returned
    return db.createRecipeObj(req.body.title, req.body.author, req.body.ingredients, req.body.instructions);
}

function deleteRecipe(req, res){
    // ex. /recipe/delete?recipeID=1234&username=jay1024
    return db.deleteRecipeObj(req.query.recipeID, req.query.username);
}

function readMyRecipes(req, res){
    // ex. /recipe/list/my?username=jay1024
    return db.getMyRecipeList(req.query.username);
}

function readSavedRecipes(req, res){
    // ex. /recipe/list/saved?username=jay1024
    return db.getSavedRecipeList(req.query.username);
}

function readRecipe(req, res){
    // ex. /recipe/detail?recipeID=1234
    return db.getRecipeInfo(req.queryrecipeID);
}

function createLike(req, res){
    // ex. /recipe/like/new?sender=jay1024&recipeID=1234
    return db.createLikeObj(req.query.sender, req.query.recipeID);
}

function deleteLike(req, res){
    // ex. /recipe/like/delete?sender=jay1024&recipeID=1234
    return db.deleteLikeObj(req.query.sender, req.query.recipeID);
}

function createComment(req, res){
    // ex. /comment/new
    return db.createCommentObj(req.body.sender, req.body.recipeID, req.body.text);
}

function deleteComment(req, res){
    // ex. /comment/delete?sender=jay1024&recipeID=1234
    return db.deleteCommentObj(req.query.sender, req.query.recipeID);
}
