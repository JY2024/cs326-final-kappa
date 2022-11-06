const port = 8080
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//Require and import cannot be used together so esm is used to get database.js
//npm install esm
const esm = require('esm')(module);
const db = esm('./database.js');
const cors = require('cors');
//Middle-ware.
//app.use(cors());
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

app.get('/user/new', (req, res) => {
    res.send(createUser(req, res));
});

app.post('/recipe/new', (req, res) => {
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
    return db.createUserObj(req.query.username, req.query.password, req.query.displayName);
}

function createRecipe(req, res){
    // ex. /recipe/new
    // POST {title: recipeName, author: author, ingredients:ingredients, instructions:instructions}
    // JSON status returned
    return db.createRecipeObj(req.body.title, req.body.author, req.body.ingredients, req.body.instructions);
}
