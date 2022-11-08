// const port = 8080
// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
//Require and import cannot be used together so esm is used to get database.js
//npm install esm
// const esm = require('esm')(module);
// const db = esm('./database.js');
// const cors = require('cors');
//Middle-ware.
//app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
//app.use(bodyParser.text());
//app.use(express.urlencoded({ extended: false }));
//app.use(express.json)
// app.listen(port);

import bodyParser from "body-parser";
import express, { response } from 'express'
import * as db from './database.js';
// import esm from 'esm'
// const esm = require('esm')(module);
// const db = esm('./database.js');
// const server = require('./server.js');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// const port = 3000;
const port = process.env.PORT
// const path = require('path');
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(path.join(__dirname));

//ROUTES

app.get('/', (req, res) => {
    console.log('At home');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/index.html'));
});

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

app.get('/main-feed.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/main-feed.html'));
});

app.get('/profile.html', (req, res) => {
    console.log('new');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile.html'));
});

app.get('/images/:imageid', (req, res) => {
    console.log('HERE FOR THE PICTURES');
    console.log(req.params.imageid);
    res.sendFile(path.join(__dirname, '/webPages/images/', req.params.imageid));
});

app.get('/CSSFiles/:cssid', (req, res) => {
    console.log('HERE FOR THE css');
    console.log(req.params.cssid);
    res.sendFile(path.join(__dirname, '/webPages/CSSFiles/', req.params.cssid));
});

app.get('/jsFiles/:jsid', (req, res) => {
    console.log('HERE FOR THE js');
    console.log(req.params.jsid);
    res.sendFile(path.join(__dirname, '/webPages/jsFiles/', req.params.jsid));
});

app.get('/profile-settings-personal-info.html', (req, res) => {
    console.log('profile check');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile-settings-personal-info.html'));
});

app.get('/profile-settings-profile-display.html', (req, res) => {
    console.log('display check');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile-settings-profile-display.html'));
});

app.get('/profile-settings-privacy.html', (req, res) => {
    console.log('privacy check');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile-settings-privacy.html'));
});

app.get('/profile-settings-security.html', (req, res) => {
    console.log('security check');
    res.sendFile(path.join(__dirname, '/webPages/htmlFiles/profile-settings-security.html'));
});

app.get('/user/new', (req, res) => {        res.send(createUser(req, res)); });
app.get('/user/delete', (req, res) => {     res.send(deleteUser(req, res)); });

app.post('/recipe/new', (req, res) => {     res.send(createRecipe(req, res));   });
app.get('/recipe/delete', (req, res) => {   res.send(deleteRecipe(req, res));   });

app.get('/recipe/like/new', (req, res) =>       {res.send(createLike(req, res));   });
app.get('/recipe/like/delete', (req, res) =>    {res.send(deleteLike(req, res));    });

app.post('/recipe/comment/new', (req, res) =>    {res.send(createComment(req, res));    });
app.get('/recipe/comment/delete', (req, res) => {res.send(deleteComment(req, res));    });

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });