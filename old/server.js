'use strict';
let http = require('http');
let url = require('url');
let fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//Require and import cannot be used together so esm is used to get database.js
//npm install esm
let esm = require('esm')(module);
module.exports = require("./database.js")



function createUser(req, res) {
    // ex. /user/new?username=jay1024&password=123&displayName=Jay

    //The following two lines cause a runtime error when uncommented
    //I added res.write just to get a response in the browser
    //createUserObj(req.params.username, req.params.password, req.params.displayName);
    //res.json({displayName: req.params.displayName});
    res.write(JSON.stringify({displayName: "dummyExample"}));
    res.end();
}

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.post("/book", (rec,res)=>{
    const book = rec.body;
    console.log(book);
    //books.push(book);

    res.send("book is added to the database");
});

app.listen(8082, () => console.log("Hello world"));




/*
const headerText = { "Content-Type": "text/html" };
let server = http.createServer();
server.on('request', async (request, response) => {
    response.writeHead(200, headerText);
    let options = url.parse(request.url, true).query;
    if (request.url.startsWith("/user/new")) {
        createUser(request,response);
        return;
    }
    else {
        response.write("no command found.");
    }
    response.end();
});
server.listen(8081);*/