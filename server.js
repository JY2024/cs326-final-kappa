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
import {createUserObj, createRecipeObj} from './database.js';
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

//ROUTES
app.get('/', (req, res) => {
    console.log('At home');
    res.sendFile(path.join(__dirname, 'recipetest.html'));
});

app.get('/user/new', (req, res) => {
    res.send(createUser(req, res));
});

app.post('/recipe/new', (req, res) => {
    console.log("IN HERE");
    res.send(createRecipe(req, res));
});

function createUser(req, res) {
    // ex. /user/new?username=jay1024&password=123&displayName=Jay
    // JSON status returned
    if (req.query.username == undefined ||
        req.query.password == undefined ||
        req.query.displayName == undefined) {
        return {Status: 'ERROR', Username: req.query.username, errMessage: 'Incomplete information'}
    }
    // return db.createUserObj(req.query.username, req.query.password, req.query.displayName);
    return createUserObj(req.query.username, req.query.password, req.query.displayName);
}

function createRecipe(req, res){
    // ex. /recipe/new
    // POST {title: recipeName, author: author, ingredients:ingredients, instructions:instructions}
    // JSON status returned
    // return db.createRecipeObj(req.body.title, req.body.author, req.body.ingredients, req.body.instructions);
    return createRecipeObj(req.body.title, req.body.author, req.body.ingredients, req.body.instructions);
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });