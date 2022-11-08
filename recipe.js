//const { request } = require("express");

//Listeners
document.getElementById('postButton').addEventListener('click',postRecipe);
document.getElementById('savedBtn').addEventListener('click', fetchSavedRecipes);
//window.onload = fetchMyRecipes;

function fetchSavedRecipes(){
    console.log("Saved recipes");
    fetch( 'http://localhost:8081/recipe/list/saved?username=jay1024' )
    .then( response => response.json() )
    .then( response => {
        // Do something with response.
        //response.send(readSavedRecipes(request,response));
        console.log(response);
        alert(response);
    } );
}

function postRecipe(){
 var recipeName=document.getElementById('titleInput').value
 var author="not_a_parrot_25"
 //var author=document.getElementById('author').value
 var ingredients=document.getElementById('ingredientInput').value
 var instructions=document.getElementById('intructionInput').value

 console.log(JSON.stringify({recipeName:recipeName, author:author, ingredients:ingredients, instructions:instructions}))

 fetch('http://localhost:8081/recipe/new', { 
    mode: 'cors',
    method: 'POST',
    headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        //"Content-type": "application/json; raw"
    },
    //body: {
    //title: recipeName,
    //author: author,
    //ingredients: ingredients,
    //instructions: instructions,
    //},
    body: "title=" + recipeName + "&author=" + author + "&ingredients=" + ingredients + "&instructions=" + instructions
  })
    .then(function (data) {
        console.log('Request succeeded with JSON response', data);
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });

};